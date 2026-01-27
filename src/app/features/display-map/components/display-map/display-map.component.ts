import { Component, inject, OnInit, signal, computed, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { LngLatLike, Map } from 'maplibre-gl';
import { IonIcon, ModalController, IonSearchbar } from '@ionic/angular/standalone';
import { FilterModalComponent } from 'src/app/shared-component/footer/filter-modal/filter-modal.component';
import { PlatformService } from 'src/app/core/auth/services/platform.service';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';
import { GeolocalisationService } from '../../service/geolocalisation.service';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-display-map',
  standalone: true,
  imports: [
    RouterModule,
    NgxMapLibreGLModule,
    IonIcon,
    IonSearchbar
  ],
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.scss'],
})
export class DisplayMapComponent implements OnInit {
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private platformService = inject(PlatformService);
  private geolocService = inject(GeolocalisationService);
  readonly mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${environment.MAPTILER_KEY}`;

  protected readonly isBrowser = this.platformService.isBrowser();
  readonly stations = input.required<any>();

  protected readonly filterValue = signal('');

  protected readonly filteredStations = computed(() => {
    const rawData = this.stations();
    let list: ChargingStationResponseDTO[] = [];

    if (!rawData) {
      list = [];
    } else if (rawData.content && Array.isArray(rawData.content)) {
      list = rawData.content;
    } else if (Array.isArray(rawData)) {
      list = rawData;
    }

    const filter = this.filterValue().toLowerCase().trim();
    if (!filter) return list;

    return list.filter(station =>
      (station.name && station.name.toLowerCase().includes(filter)) ||
      (station.locationDTO?.addressLine && station.locationDTO.addressLine.toLowerCase().includes(filter))
    );
  });

  map: Map | undefined;
  center: LngLatLike = [4.8522, 45.7566];
  hoverStation?: ChargingStationResponseDTO;
  ControlType = ControlType;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const navigation = this.router.getCurrentNavigation();

    const state = navigation?.extras?.state as {
      filteredStations?: ChargingStationResponseDTO[],
      searchTerm?: string,
      center?: [number, number]
    };

    if (state) {
      setTimeout(() => {
        // CAS 1 : On a reçu des coordonnées directes (depuis le Dashboard)
        if (state.center) {
          if (state.searchTerm) this.filterValue.set(state.searchTerm);

          // Vol vers la destination
          this.map?.flyTo({
            center: state.center,
            zoom: 13,
            essential: true
          });
        }
        // CAS 2 : On a reçu juste un mot-clé
        else if (state.searchTerm) {
          this.handleSearch(state.searchTerm);
        }
        // CAS 3 : On a reçu une liste de stations
        else if (state.filteredStations?.length) {
          const firstStation = state.filteredStations![0];
          this.filterValue.set(firstStation.name);
          this.centerMapOnStation(firstStation);
        }
      }, 800);
    }
  }

  onMapLoad(map: Map): void {
    this.map = map;
  }

  onHover(station: ChargingStationResponseDTO): void {
    this.hoverStation = station;
  }

  onLeave(): void {
    this.hoverStation = undefined;
  }

  // EVENT SEARCHBAR
  onLocalSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const value = target.value || '';
    this.handleSearch(value);
  }

  // LOGIQUE CENTRALE DE RECHERCHE
  private handleSearch(value: string) {
    this.updateFilter(value.toLowerCase());

    // 2. Si aucune station trouvée en local, on cherche la ville via API
    if (value.length > 2 && this.filteredStations().length === 0) {
      this.geolocService.searchCity(value).subscribe(coords => {
        if (coords) {
          console.log('Ville trouvée via API:', coords);
          this.map?.flyTo({
            center: [coords.lng, coords.lat],
            zoom: 12,
            essential: true
          });
        }
      });
    }
  }

  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      initialBreakpoint: 0.45,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: 'bottom-sheet',
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.handleSearch(data);
    }
  }

  private updateFilter(value: string) {
    this.filterValue.set(value);

    // On force la récupération de la liste filtrée
    const currentList = this.filteredStations();

    if (currentList.length > 0) {
      // Si on a trouvé des bornes, on centre sur la première
      this.centerMapOnStation(currentList[0]);
    }
  }

  private centerMapOnStation(station: ChargingStationResponseDTO): void {
    const lng = Number(station.lng) || 0;
    const lat = Number(station.lat) || 0;

    if (lng === 0 && lat === 0) return;

    this.center = [lng, lat];

    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true,
        speed: 1.5
      });
    }
  }
}
