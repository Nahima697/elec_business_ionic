import { Component, input, signal } from '@angular/core';
import { ChargingStation } from '../../models/chargingStation.model';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { Map, GeolocateControl } from 'maplibre-gl';

@Component({
  selector: 'app-station-map',
  standalone: true,
  imports: [NgxMapLibreGLModule],
  templateUrl: './station-map.component.html',
  styleUrls: ['./station-map.component.scss'],
})
export class StationMapComponent {
  readonly station = input<ChargingStation>();
  readonly hoverStation = signal<ChargingStation | null>(null);
  map!: Map;

  // centre initial, si station dispo
  get center(): [number, number] {
    const s = this.station();
    return s ? [s.lng ?? 0, s.lat ?? 0] : [0, 0];
  }

  onMapLoad(map: Map) {
    this.map = map;
    this.setupGeolocateControl(map);
    // centrer la map sur la station
    if (this.station()) {
      map.flyTo({ center: this.center, zoom: 15, essential: true });
    }
  }

  private setupGeolocateControl(map: Map) {
    const geolocate = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });

    map.addControl(geolocate);

    geolocate.on('geolocate', (pos) => console.log('Position user:', pos.coords));
    geolocate.on('error', () => console.warn('Erreur géolocate'));
  }

  onMarkerEnter(station: ChargingStation) {
    this.hoverStation.set(station);
  }

  onMarkerLeave() {
    this.hoverStation.set(null);
  }
}
