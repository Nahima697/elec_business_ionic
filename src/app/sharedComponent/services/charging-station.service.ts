import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BASE_URL =environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {

  constructor() { }

  private http = inject(HttpClient)

  getChargingStations() {
    return this.http.get(`${BASE_URL}/charging_station`)
  }
  getChargingStationDetail(id:string) {
    return this.http.get(`${BASE_URL}/charging_station/${id}`)
  }

}
