import { httpResource } from '@angular/common/http';
import {  Injectable, Signal } from '@angular/core';
import { ChargingStationResponseDTO } from '../models/charging-station.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class StationApiService {
   private apiUrl = environment.apiUrl;
 getAll() {
  return httpResource<ChargingStationResponseDTO[]>(() => `${this.apiUrl}/charging_stations`)
 }

   getOne(id:Signal<string>) {
    return httpResource<ChargingStationResponseDTO>(() => `${this.apiUrl}/charging_stations/`+id());
  }
}
