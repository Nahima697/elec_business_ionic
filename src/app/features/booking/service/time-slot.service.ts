import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TimeSlotResponseDTO } from '../models/timeSlot';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TimeSlotService {

  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getSlotsForDate(stationId: string, date: string) : Observable<TimeSlotResponseDTO[]>{
    return this.http.get<TimeSlotResponseDTO[]>(
      `${this.api}/time_slots/station/${stationId}/day`,
      {
        params: { date }
      }
    );
  }

}
