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
  // Plus besoin de PlatformService ni Filesystem

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
      next: (blob) => {
        // Méthode universelle (Web standard)
        // Sur mobile, cela demandera à l'utilisateur d'ouvrir ou enregistrer le fichier selon son navigateur
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservation-${bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Nettoyage
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur téléchargement API:', err);
        this.showErrorToast('Impossible de télécharger le reçu.');
      }
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
