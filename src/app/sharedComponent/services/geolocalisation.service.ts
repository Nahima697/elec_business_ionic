import { inject, Injectable } from '@angular/core';
import { PlatformService } from './platform.service';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocalisationService {

  private platformService = inject(PlatformService);

  async getCurrentPosition()
  {
    if (this.platformService.isNative()) {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
    return {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

  }
else
{
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err)
    );
  });
  }

  }

  watchPosition(
    callback: (coords: { lat: number; lng: number }) => void
  ): Promise<String> {
    const watchId = Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (position, error) => {
        if (error) {
          console.error('Erreur de géolocalisation :', error);
          return;
        }

        if (position) {
          callback({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      }
    );

    return watchId;
  }
}
