import { httpResource } from '@angular/common/http';
import {  Injectable, Signal } from '@angular/core';
import { ChargingStationPage, ChargingStationResponseDTO } from '../models/charging-station.model';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/core/models/page.model';


@Injectable({
  providedIn: 'root'
})

export class StationApiService {
   private apiUrl = environment.apiUrl;
 getAll() {
  return httpResource<ChargingStationPage>(() => `/charging_stations`)
 }

   getOne(id:Signal<string>) {
    return httpResource<ChargingStationResponseDTO>(() => `/charging_stations/`+id());
  }
}
