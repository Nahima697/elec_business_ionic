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
import { documentTextOutline, alertCircleOutline, checkmarkCircleOutline, starOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-renter-bookings',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    BookingRequestCardComponent, IonRefresher, IonRefresherContent,
    IonBackButton, IonButtons, IonButton, IonIcon,
    RouterLink
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/user/renter/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Mes Réservations</ion-title>
      </ion-toolbar>
        <ion-back-button
        defaultHref="/user/renter/dashboard"
        text="Retour"
      ></ion-back-button>
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

            <div class="flex flex-wrap gap-2 mx-1">

              @if (booking.statusLabel === 'ACCEPTED' || booking.statusLabel === 'COMPLETED') {
                <ion-button
                  fill="outline"
                  color="primary"
                  size="small"
                  (click)="downloadPdf(booking.id)"
                >
                  <ion-icon slot="start" name="document-text-outline"></ion-icon>
                  Reçu
                </ion-button>
              }

              @if (booking.statusLabel === 'COMPLETED') {
                <ion-button
                  fill="outline"
                  color="warning"
                  size="small"
                  [routerLink]="['/station', booking.stationId, 'review', booking.id]"
                >
                  <ion-icon slot="start" name="star-outline"></ion-icon>
                  Laisser un avis
                </ion-button>
              }
            </div>

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

  bookings = signal<BookingResponseDTO[]>([]);

  constructor() {
    addIcons({ documentTextOutline, alertCircleOutline, checkmarkCircleOutline, starOutline });
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
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservation-${bookingId}.pdf`;
        document.body.appendChild(a);
        a.click();
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
