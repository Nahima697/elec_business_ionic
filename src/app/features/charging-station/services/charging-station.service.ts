import { HttpClient,  httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChargingStationPage, ChargingStationRequestDTO, ChargingStationResponseDTO } from '../models/charging-station.model';
import { Observable } from 'rxjs';
import { Page } from 'src/app/core/models/page.model';


@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {

  private http = inject(HttpClient);
  getChargingStations()  {
    return httpResource<ChargingStationPage>(()=>`/charging_stations`);
  }

  getMyStations() {
    return httpResource<ChargingStationResponseDTO[]>(() => `/charging_stations/me`);
  }
  getChargingStationDetail(id:string) :Observable<ChargingStationResponseDTO>   {
    return this.http.get<ChargingStationResponseDTO>(`/charging_stations/${id}`);
  }

  createStation(station: ChargingStationRequestDTO, imageFile?: File): Observable<ChargingStationResponseDTO> {
    const formData = new FormData();

    formData.append('name', station.name);
    formData.append('description', station.description);
    formData.append('powerKw', station.powerKw.toString());
    formData.append('price', station.price.toString());
    formData.append('lng', station.lng.toString());
    formData.append('lat', station.lat.toString());
    formData.append('locationId', station.locationId);

    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.http.post<ChargingStationResponseDTO>('/charging_stations', formData);
  }

  updateChargingStation(station: ChargingStationRequestDTO) : Observable<ChargingStationResponseDTO> {
    return this.http.put<ChargingStationRequestDTO>(`/charging_stations/${station.id}`,station);
  }

  deleteChargingStation(id:string): Observable<void> {
    return this.http.delete<void>(`/charging_stations/${id}`);
  }

  getStationsByLocationId(locationId:string) : Observable<ChargingStationResponseDTO[]> {
    return this.http.get<ChargingStationResponseDTO[]>(`/charging_stations/location/${locationId}`);
  }

}
