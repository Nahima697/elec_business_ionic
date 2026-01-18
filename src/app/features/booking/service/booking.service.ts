import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BookingRequestDTO, BookingResponseDTO } from '../models/booking';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);

 createBooking(booking:BookingRequestDTO) {
  return this.http.post<BookingResponseDTO>('/bookings',booking)
 }

 getMyBookingsOwner() {
  return this.http.get<BookingResponseDTO[]>('/bookings/owner/me');
}

 getMyBookingsRenter() {
  return this.http.get<BookingResponseDTO[]>('/bookings/renter/me');
}
downloadBookingPdf(bookingId: string): Observable<Blob> {
  return this.http.get(`/'pdf/booking/${bookingId}`, { responseType: 'blob' });
}
// Accepter une réservation
  acceptBooking(bookingId: string): Observable<BookingResponseDTO> {
    return this.http.post<BookingResponseDTO>(`/bookings/${bookingId}/accept`, {});
  }

  // Rejeter une réservation
  rejectBooking(bookingId: string): Observable<BookingResponseDTO> {
    return this.http.post<BookingResponseDTO>(`/bookings/${bookingId}/reject`, {});
  }

hasUserBookedStation(stationId: string) {
  return this.getMyBookingsRenter().pipe(
    map((bookings: BookingResponseDTO[]) => bookings.some(b => b.stationId === stationId))
  );
}

updateBookingStatus(bookingId: string, status: string): Observable<BookingResponseDTO> {
  return this.http.post<BookingResponseDTO>(`/bookings/${bookingId}/status?status=${status}`, {});
}

}
