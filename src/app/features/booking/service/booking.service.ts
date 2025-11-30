import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Booking } from 'src/app/sharedComponent/models/reservation.model';
import { BookingRequestDTO, BookingResponseDTO } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);

 createBooking(booking:BookingRequestDTO) {
  return this.http.post<BookingResponseDTO>('/bookings',booking)
 }

 getMyBookings() {
  return this.http.get<BookingResponseDTO[]>('/bookings/me');
}

}
