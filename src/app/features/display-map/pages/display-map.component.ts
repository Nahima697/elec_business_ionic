import { Component, inject, OnInit, signal, computed, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { LngLatLike, Map, GeolocateControl } from 'maplibre-gl';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { IonIcon, ModalController } from '@ionic/angular/standalone';
import { FilterModalComponent } from 'src/app/shared-component/filter-modal/filter-modal.component';
import { PlatformService } from 'src/app/shared-component/services/platform.service';
import { ChargingStation } from 'src/app/features/charging-station/models/charging-station.model';

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
  private platformService = inject(PlatformService);

  map!: Map;

  protected readonly isBrowser = this.platformService.isBrowser();
  readonly stations = input.required<ChargingStation[]>();
  protected readonly filterValue = signal('');

  protected readonly filteredStations = computed(() => {
    const list = this.stations();
    if (!list) return [];
    const filter = this.filterValue().toLowerCase();
    return list.filter(station =>
      station.name.toLowerCase().includes(filter) ||
      station.locationDTO.name.toLowerCase().includes(filter)
    );
  });

  center: LngLatLike = [4.8522, 45.7566];
  hoverStation?: ChargingStation;
  ControlType = ControlType;

ngOnInit(): void {
  if (!this.platformService.isBrowser) return;

  const state = this.getRouterState();
  const stationsFromState = state?.filteredStations;
  if (stationsFromState && stationsFromState.length > 0) {
    setTimeout(() => {
      const firstStation = stationsFromState[0];
      this.filterValue.set(firstStation.name);
      this.centerMapOnStation(firstStation);
    }, 0);
  }
  }

  onMapLoad(map: Map): void {
    if (!this.platformService.isBrowser) return;

    this.map = map;
    this.setupGeolocateControl(map);
  }

  onHover(station: ChargingStation): void {
    this.hoverStation = station;
  }

  onLeave(): void {
    this.hoverStation = undefined;
  }

  onLocalSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    this.filterValue.set(value);

    const stations = this.filteredStations();
    if (stations.length) {
      this.centerMapOnStation(stations[0]);
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
    this.filterValue.set(filterValue);

    const stations = this.filteredStations();
    if (stations.length) {
      this.centerMapOnStation(stations[0]);
    }
  }

  private centerMapOnStation(station: ChargingStation) {
    const lng = station.lng ?? station.lng ?? 0;
    const lat = station.lat ?? station.lat ?? 0;
    this.center = [lng, lat];
    if (this.map) {
      this.map.flyTo({
        center: this.center,
        zoom: 15,
        essential: true
      });
    }
  }

  private getRouterState(): { filteredStations?: ChargingStation[] } | undefined {
    return this.router.getCurrentNavigation()?.extras?.state as { filteredStations?: ChargingStation[] };
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


}
