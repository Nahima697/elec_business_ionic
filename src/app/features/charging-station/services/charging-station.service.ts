import { HttpClient,  httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChargingStation } from '../models/chargingStation.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {

  private http = inject(HttpClient);
  getChargingStations()  {
    return httpResource<ChargingStation[]>(()=>`/charging_stations`);
  }
  getChargingStationDetail(id:string) :Observable<ChargingStation>   {
    return this.http.get<ChargingStation>(`/charging_stations/${id}`);
  }

  createStation(station: Omit<ChargingStation,'id'>) : Observable<ChargingStation>{
    return this.http.post<ChargingStation>('/charging_stations/',station);
  }

  updateChargingStation(station: Omit<ChargingStation,'id'>,id:string) : Observable<ChargingStation> {
    return this.http.put<ChargingStation>(`/charging_stations/${id}`,station);
  }

  deleteChargingStation(id:string) {
    return this.http.delete<ChargingStation>(`/charging_stations/${id}`);
  }

  getStationsByLocationId(locationId:string) : Observable<ChargingStation[]> {
    return this.http.get<ChargingStation[]>(`/charging_stations/location/${locationId}`);
  }

}
