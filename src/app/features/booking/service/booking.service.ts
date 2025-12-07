import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BookingRequestDTO, BookingResponseDTO } from '../models/booking';
import { map } from 'rxjs';

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

hasUserBookedStation(stationId: string) {
  return this.getMyBookings().pipe(
    map((bookings: BookingResponseDTO[]) => bookings.some(b => b.stationId === stationId))
  );
}

}
