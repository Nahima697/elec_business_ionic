import { inject, Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocalisationService {

  async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

      console.log('Position actuelle:', coordinates);

      return {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la position', error);
      throw error;
    }
  }

  async watchPosition(callback: (coords: { lat: number; lng: number }) => void): Promise<string> {
    const watchId = await Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (position, error) => {
        if (error) {
          console.error('Erreur de tracking :', error);
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

  async stopWatching(watchId: string) {
      if (watchId) {
          await Geolocation.clearWatch({ id: watchId });
      }
  }
}
