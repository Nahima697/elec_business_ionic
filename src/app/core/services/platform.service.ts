import { Component, inject, signal } from '@angular/core';
import { BookingService } from 'src/app/features/booking/service/booking.service';
import { BookingResponseDTO } from 'src/app/features/booking/models/booking';
import { BookingRequestCardComponent } from 'src/app/features/booking/component/booking-request-card/booking-request-card.component';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher,
  IonRefresherContent, IonBackButton, IonButtons, IonButton, IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { PlatformService } from '../auth/services/platform.service';

@Component({
  selector: 'app-renter-bookings',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    BookingRequestCardComponent, IonRefresher, IonRefresherContent,
    IonBackButton, IonButtons, IonButton, IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/user/renter/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Mes Réservations</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" color="light">
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="space-y-4">
        @for (booking of bookings(); track booking.id) {
          <div class="flex flex-col gap-2">
            <app-booking-request-card
              [booking]="booking"
              [isOwner]="false"
            />

            @if (booking.statusLabel === 'ACCEPTED' || booking.statusLabel === 'COMPLETED') {
              <ion-button
                expand="block"
                fill="outline"
                color="primary"
                class="mx-1"
                (click)="downloadPdf(booking.id)"
              >
                <ion-icon slot="start" name="document-text-outline"></ion-icon>
                Télécharger le reçu
              </ion-button>
            }
          </div>
        } @empty {
          <div class="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>Aucune réservation en cours.</p>
          </div>
        }
      </div>
    </ion-content>
  `
})
export class RenterBookingPage {
  private bookingService = inject(BookingService);
  private toastCtrl = inject(ToastController);
  private platformService = inject(PlatformService);

  bookings = signal<BookingResponseDTO[]>([]);

  constructor() {
    addIcons({ documentTextOutline, alertCircleOutline, checkmarkCircleOutline });
    this.loadBookings();
  }

  loadBookings(event?: any) {
    this.bookingService.getMyBookingsRenter().subscribe({
      next: (data) => {
        this.bookings.set(data);
        event?.target.complete();
      },
      error: () => event?.target.complete()
    });
  }

  refresh(event: any) {
    this.loadBookings(event);
  }

  downloadPdf(bookingId: string) {
    this.bookingService.downloadBookingPdf(bookingId).subscribe({
      next: async (blob) => {

        if (this.platformService.isNative()) {
          try {
            const base64Data = await this.blobToBase64(blob);
            const fileName = `reservation-${bookingId}.pdf`;

            const result = await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents
            });

            console.log('Fichier écrit :', result.uri);

            const toast = await this.toastCtrl.create({
              message: `Reçu téléchargé dans Documents !`,
              duration: 3000,
              color: 'success',
              position: 'bottom',
              icon: 'checkmark-circle-outline'
            });
            toast.present();

          } catch (e) {
            console.error('Erreur écriture fichier mobile', e);
            this.showErrorToast('Erreur lors de la sauvegarde sur le téléphone.');
          }
        }
        // 💻 LOGIQUE WEB (Ordinateur)
        else {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reservation-${bookingId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => {
        console.error('Erreur téléchargement API:', err);
        this.showErrorToast('Impossible de télécharger le reçu.');
      }
    });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject('Erreur conversion base64');
        }
      };
      reader.readAsDataURL(blob);
    });
  }

  private async showErrorToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
      icon: 'alert-circle-outline'
    });
    toast.present();
  }
}
