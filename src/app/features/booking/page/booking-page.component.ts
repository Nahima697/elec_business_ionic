import { Component, inject, OnInit } from '@angular/core';
import { BookingFormComponent } from 'src/app/features/booking/component/booking-form/booking-form.component';
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
    BookingFormComponent
  ]
})
export class BookingPageComponent  implements OnInit {

  private bookingService = inject(BookingService);

  bookings: BookingResponseDTO[] = [];
  loading = false;
  submitting = false;

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  handleFormSubmit(event: { booking: BookingRequestDTO}) {
    this.submitting = true;

    this.bookingService.createBooking(event.booking).subscribe({
      next: (created) => {
        this.submitting = false;
        this.bookings = [created, ...this.bookings];
      },
      error: () => this.submitting = false
    });
  }

}
