import { HttpClient } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { catchError, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChargingLocation } from '../models/chargingLocation.model';

const BASE_URL =environment.apiUrl;


@Injectable({
  providedIn: 'root'
})
export class ChargingLocationService {

  constructor() { }

  private http = inject(HttpClient);

  getChargingLocations() : Observable<ChargingLocation[]> {
    return this.http.get<ChargingLocation[]>(`${BASE_URL}/charging_locations`).pipe(
     catchError(error => {
      console.error('Erreur lors de la récupération des lieux', error);
      throw error;
      })
    );
  }

  getLocationByUser() : Observable<ChargingLocation[]> {
     return this.http.get<ChargingLocation[]>(`${BASE_URL}/charging_locations/user`).pipe(
     catchError(error => {
      console.error('Erreur lors de la récupération des lieux', error);
      throw error;
      })
    );

  }

  createLocation(location: Omit<ChargingLocation,'id'>) : Observable<ChargingLocation>{
    return this.http.post<ChargingLocation>(`${BASE_URL}/charging_locations/`,location).pipe(
    catchError(error => {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      throw error;
    })
  );
  }

  getChargingLocationDetail(id:string) : Observable<ChargingLocation> {
    return this.http.get<ChargingLocation>(`${BASE_URL}/charging_locations/${id}`);
  }

  updateChargingLocation(location: Omit<ChargingLocation,'id'>,id:string) : Observable<ChargingLocation> {
    return this.http.put<ChargingLocation>(`${BASE_URL}/charging_locations/${id}`,location);
  }

}
