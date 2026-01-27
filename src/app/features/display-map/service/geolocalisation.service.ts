import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { env } from 'process';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocalisationService {
  private http = inject(HttpClient);
  private MAPTILER_KEY = environment.MAPTILER_KEY;

  async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

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
  geocodeAddress(address: string): Observable<{ lat: number, lng: number } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (results && results.length > 0) {
          return {
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon)
          };
        }
        return null;
      })
    );
  }
  searchCity(query: string): Observable<{ lat: number, lng: number } | null> {
    if (!query || query.length < 3) return of(null);

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${this.MAPTILER_KEY}&limit=1`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.features && response.features.length > 0) {
          const [lng, lat] = response.features[0].center;
          return { lat, lng };
        }

        return null;
      }),
      catchError(err => {
        console.error('Erreur geocoding:', err);
        return of(null);
      })
    );
  }
}

