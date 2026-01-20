import { Component, inject, signal } from '@angular/core';
import { BookingService } from 'src/app/features/booking/service/booking.service';
import { BookingResponseDTO } from 'src/app/features/booking/models/booking';
import { BookingRequestCardComponent } from 'src/app/features/booking/component/booking-request-card/booking-request-card.component';
import { IonContent, IonHeader, IonTitle, IonToolbar,ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-owner-bookings',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, BookingRequestCardComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Réservations reçues</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @for (booking of bookings(); track booking.id) {
        <app-booking-request-card
          [booking]="booking"
          [isOwner]="true"
          (onAccept)="handleAccept($event)"
          (onReject)="handleReject($event)"
        />
      } @empty {
        <p class="text-center text-gray-500 mt-10">Aucune demande reçue.</p>
      }
    </ion-content>
  `
})
export class BookingPage {
  private bookingService = inject(BookingService);
  bookings = signal<BookingResponseDTO[]>([]);
  private toastCtrl = inject(ToastController);

  constructor() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getMyBookingsOwner().subscribe(data => this.bookings.set(data));
  }

  handleAccept(booking: BookingResponseDTO) {
    this.bookingService.acceptBooking(booking.id).subscribe(() => this.loadBookings());
  }

  handleReject(booking: BookingResponseDTO) {
    this.bookingService.rejectBooking(booking.id).subscribe(() => this.loadBookings());
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
      error: async (err) => {
        console.error('Erreur PDF:', err);
        const toast = await this.toastCtrl.create({
          message: 'Impossible de télécharger le reçu. Veuillez réessayer plus tard.',
          duration: 3000,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        });
        toast.present();
      }
    });
  }
}
