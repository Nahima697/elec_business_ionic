import { httpResource } from '@angular/common/http';
import {  Injectable, Signal } from '@angular/core';
import { ChargingStation } from '../models/chargingStation.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class StationApiService {
   private apiUrl = environment.apiUrl;
 getAll() {
  return httpResource<ChargingStation[]>(() => `${this.apiUrl}/charging_stations`)
 }

   getOne(id:Signal<string>) {
    return httpResource<ChargingStation>(() => `${this.apiUrl}/charging_stations/`+id());
  }
}
