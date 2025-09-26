import { httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { ChargingStation } from '../models/chargingStation.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StationApiService {
 getAll() {
  return httpResource<ChargingStation[]>(() => environment.apiUrl +'/charging_stations')
 }

   getOne(id:Signal<string>) {
    return httpResource<ChargingStation>(() => environment.apiUrl+'/api/charging_stations/'+id());
  }
}
