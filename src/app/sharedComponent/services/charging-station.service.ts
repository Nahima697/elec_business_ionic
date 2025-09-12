import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChargingStation } from '../models/chargingStation.model';
import { Observable } from 'rxjs';
import { STATION } from '../station/station.component';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ChargingLocation } from '../models/chargingLocation.model';

const BASE_URL =environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {

  constructor() { }

  private http = inject(HttpClient);
  private authService = inject(AuthService);
    token = this.authService.getToken;
  httpoptions = new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
    'Authorization': `Bearer ${this.token}`
  });

  getChargingStations() : Observable<ChargingStation[]>  {
    return this.http.get<ChargingStation[]>(`${BASE_URL}/charging_stations`);
  }
  getChargingStationDetail(id:string) :Observable<ChargingStation>   {
    return this.http.get<ChargingStation>(`${BASE_URL}/charging_stations/${id}`);
  }

  createStation(station: Omit<ChargingStation,'id'>) : Observable<ChargingStation>{
    return this.http.post<ChargingStation>(`${BASE_URL}/charging_stations/`,station);
  }

  updateChargingStation(station: Omit<ChargingStation,'id'>,id:string) : Observable<ChargingStation> {
    return this.http.put<ChargingStation>(`${BASE_URL}/charging_stations/${id}`,station);
  }

  deleteChargingStation(id:string) {
    return this.http.delete<ChargingStation>(`${BASE_URL}/charging_stations/${id}`);
  }

  getStationsByLocationId(locationId:string) : Observable<ChargingStation[]> {
    return this.http.get<ChargingStation[]>(`${BASE_URL}/charging_stations/location/${locationId}`);
  }

}
