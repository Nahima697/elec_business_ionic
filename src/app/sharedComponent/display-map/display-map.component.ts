import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { LngLatLike, Map, GeolocateControl } from 'maplibre-gl';
import { Station, STATION } from '../station/station.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ControlType } from '../form-field/form-field.enum.';
import { IonIcon, ModalController, IonContent } from '@ionic/angular/standalone';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { MapLibreSearchControl } from "@stadiamaps/maplibre-search-box";
import "@stadiamaps/maplibre-search-box/dist/maplibre-search-box.css";

@Component({
  selector: 'app-display-map',
  standalone: true,
  imports: [
    RouterModule,
    NgxMapLibreGLModule,
    FormFieldComponent,
    FilterModalComponent,
    IonIcon
  ],
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.scss'],
})
export class DisplayMapComponent implements OnInit {
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  map!: Map;
  stations: Station[] = STATION;
  filteredStations: Station[] = [];
  center: LngLatLike = [4.8522, 45.7566];
  hoverStation?: Station;
  ControlType = ControlType;

  ngOnInit(): void {
    const state = this.getRouterState();

    this.filteredStations = state?.filteredStations?.length
      ? state.filteredStations
      : this.stations;

    if (this.filteredStations.length) {
      this.centerMapOnStation(this.filteredStations[0]);
    }
  }

  onMapLoad(map: Map): void {
    this.map = map;

    this.setupGeolocateControl(map);
    // this.setupSearchControl(map);
  }

  onHover(station: Station): void {
    this.hoverStation = station;
  }

  onLeave(): void {
    this.hoverStation = undefined;
  }

  onLocalSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value?.toLowerCase() || '';

    this.filteredStations = this.stations.filter(station =>
      station.nom.toLowerCase().includes(value) ||
      station.adresse.toLowerCase().includes(value)
    );

    if (this.filteredStations.length) {
      this.centerMapOnStation(this.filteredStations[0]);
    }
  }

  openFilterModal() {
    this.modalCtrl.create({
      component: FilterModalComponent,
      initialBreakpoint: 0.45,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: 'bottom-sheet',
    }).then(modal => modal.present());
  }

  onFilterChange(filterValue: string) {
    this.filteredStations = this.stations.filter(station =>
      station.nom.toLowerCase().includes(filterValue) ||
      station.adresse.toLowerCase().includes(filterValue)
    );

    if (this.filteredStations.length) {
      this.centerMapOnStation(this.filteredStations[0]);
    }
  }

  private centerMapOnStation(station: Station) {
    this.center = [station.longitude, station.latitude];
    if (this.map) {
      this.map.flyTo({
        center: this.center,
        zoom: 15,
        essential: true
      });
    }
  }

  private getRouterState(): { filteredStations?: Station[] } | undefined {
    return this.router.getCurrentNavigation()?.extras?.state as { filteredStations?: Station[] };
  }

  private setupGeolocateControl(map: Map): void {
    const state = this.getRouterState();
    const geolocate = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });

    map.addControl(geolocate);

    if (!state?.filteredStations?.length) {
      setTimeout(() => {
        try {
          geolocate.trigger();
        } catch (err) {
          console.warn('Erreur lors de la géolocalisation :', err);
        }
      }, 1000);
    }

    geolocate.on('geolocate', position => {
      console.log('Position trouvée :', position.coords);
    });

    geolocate.on('error', () => {
      console.warn('Erreur lors de la localisation');
    });
  }

  // private setupSearchControl(map: Map): void {
  //   const control = new MapLibreSearchControl({
  //     onResultSelected: (feature) => {
  //       console.log('Résultat sélectionné', feature);
  //       // TODO: Tu peux ici adapter `this.center` et déclencher un filtre si pertinent
  //     },
  //   });

  //   map.addControl(control, 'top-left');
  // }
}
