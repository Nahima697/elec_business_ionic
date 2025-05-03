import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { LngLatLike, Map, GeolocateControl } from 'maplibre-gl';
import { Station, STATION } from '../station/station.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ControlType } from '../form-field/form-field.enum.';
import { IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-display-map',
  standalone: true,
  imports: [RouterModule, NgxMapLibreGLModule, FormFieldComponent],
  template: `
    <app-form-field
      label="Rechercher"
      placeholder="Votre adresse"
      [controlType]="ControlType.Search"
      type="search"
      #ionInputEl
      (ionInput)="onLocalSearch($event)"
    ></app-form-field>

    <div class="map-wrap">
      <mgl-map
        class="map"
        [style]="'https://api.maptiler.com/maps/streets-v2/style.json?key=pUgm4NlEXg3amyAe53SH'"
        [zoom]="[14]"
        [center]="center"
        (mapLoad)="onMapLoad($event)"
      >
        @for (station of filteredStations; track station.id) {
          <mgl-marker
            [lngLat]="[station.longitude, station.latitude]"
            [className]="'charger-marker'"
          >
            <div
              class="charger-marker"
              (mouseenter)="onHover(station)"
              (mouseleave)="onLeave()"
              (click)="onHover(station)"
            >
              <img
                src="assets/icons/battery.png"
                alt="Borne"
              />
            </div>
          </mgl-marker>

          @if (hoverStation?.id === station.id) {
            <mgl-popup
              [lngLat]="[station.longitude, station.latitude]"
              [closeButton]="true"
              [closeOnClick]="true"
              [anchor]="'top'"
            >
              <div>
                <h3>{{ station.nom }}</h3>
                <p>{{ station.adresse }}</p>
                <p><strong>Puissance:</strong> {{ station.puissance }}</p>
              </div>
            </mgl-popup>
          }
        }

        <mgl-control mglNavigation
        mglGeolocate
        [positionOptions]="{ enableHighAccuracy: true }"
        [trackUserLocation]="true"
        [showUserLocation]="true"
        position="top-right" />

      </mgl-map>
    </div>
  `,
  styleUrls: ['./display-map.component.scss'],
})
export class DisplayMapComponent implements OnInit {
  map!: Map;
  stations: Station[] = STATION;
  filteredStations: Station[] = [];
  center: LngLatLike = [4.8522, 45.7566];
  hoverStation?: Station;
  ControlType = ControlType;

  @Output() ionInput = new EventEmitter<any>();
  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  ngOnInit(): void {
    this.filteredStations = this.stations;
  }

  onMapLoad(map: Map): void {
    this.map = map;

    const geolocate = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });

    map.addControl(geolocate);

    setTimeout(() => {
      try {
        geolocate.trigger();
      } catch (err) {
        console.warn('Erreur lors de la géolocalisation :', err);
      }
    }, 1000);

    geolocate.on('geolocate', (position) => {
      console.log('Position trouvée :', position.coords);
    });

    geolocate.on('error', () => {
      console.warn('Erreur lors de la localisation');
    });
  }

  onHover(station: Station): void {
    this.hoverStation = station;
  }

  onLeave(): void {
    this.hoverStation = undefined;
  }

  onLocalSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const value = inputElement.value?.toLowerCase() || '';
    this.filteredStations = this.stations.filter(station =>
      station.nom.toLowerCase().includes(value) ||
      station.adresse.toLowerCase().includes(value)
    );
    console.log(this.filteredStations);
    if (this.filteredStations.length > 0 && this.map) {
      const firstStation = this.filteredStations[0];
      this.map.flyTo({
        center: [firstStation.longitude, firstStation.latitude],
        zoom: 15,
        essential: true
      });
    }

  }

}
