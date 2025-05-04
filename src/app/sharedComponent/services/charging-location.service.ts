import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BASE_URL =environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ChargingLocationService {

  constructor() { }

  private http = inject(HttpClient)

  getChargingLocations() {
    return this.http.get(`${BASE_URL}/charging_location`)
  }

  // postChargingLocation() {
  //   return this.http.post(`${BASE_URL}/charging_location`)
  // }

  getChargingLocationDetail(id:string) {
    return this.http.get(`${BASE_URL}/charging_location/$`)
  }
}
