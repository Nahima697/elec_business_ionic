import { Component, inject, signal } from '@angular/core';
import { BookingService } from 'src/app/features/booking/service/booking.service';
import { BookingResponseDTO } from 'src/app/features/booking/models/booking';
import { BookingRequestCardComponent } from 'src/app/features/booking/component/booking-request-card/booking-request-card.component';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent,IonBackButton,IonButtons} from '@ionic/angular/standalone';

@Component({
  selector: 'app-renter-bookings',
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, BookingRequestCardComponent, IonRefresher, IonRefresherContent,IonBackButton,IonButtons],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/user/renter/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Mes Réservations</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @for (booking of bookings(); track booking.id) {
        <app-booking-request-card
          [booking]="booking"
          [isOwner]="false"
        />
      } @empty {
        <div class="flex flex-col items-center justify-center h-64 text-gray-500">
          <p>Aucune réservation en cours.</p>
        </div>
      }
    </ion-content>
  `
})
export class RenterBookingPage {
  private bookingService = inject(BookingService);
  bookings = signal<BookingResponseDTO[]>([]);

  constructor() {
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
  this.bookingService.downloadBookingPdf(bookingId).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservation-${bookingId}.pdf`;
    a.click();
  });
}
}
