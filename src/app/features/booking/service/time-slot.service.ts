import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TimeSlotResponseDTO } from '../models/timeSlot';

@Injectable({ providedIn: 'root' })
export class TimeSlotService {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getSlotsForDate(stationId: string, date: string) {
    return this.http.get<TimeSlotResponseDTO[]>(
      `${this.api}/time_slots/station/${stationId}/day`,
      {
        params: { date }
      }
    );
  }

}
