import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { BookingRequestDTO, BookingResponseDTO } from 'src/app/features/booking/models/booking';
import { BookingService } from 'src/app/features/booking/service/booking.service';
@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
   imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
  ]
})
export class BookingPageComponent  implements OnInit {

  private bookingService = inject(BookingService);

  bookings: BookingResponseDTO[] = [];
  loading = false;

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getMyBookingsOwner().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

}
