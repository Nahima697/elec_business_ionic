import { Component, inject, signal, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { LngLatLike, Map } from 'maplibre-gl';
import { IonIcon, ModalController, IonSearchbar } from '@ionic/angular/standalone';
import { FilterModalComponent } from 'src/app/shared-component/footer/filter-modal/filter-modal.component';
import { PlatformService } from 'src/app/core/auth/services/platform.service';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';
import { GeolocalisationService } from '../../service/geolocalisation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-display-map',
  standalone: true,
  imports: [RouterModule, NgxMapLibreGLModule, IonIcon, IonSearchbar],
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.scss'],
})
export class DisplayMapComponent {
  private modalCtrl = inject(ModalController);
  private platformService = inject(PlatformService);
  private geolocService = inject(GeolocalisationService);
  readonly mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${environment.MAPTILER_KEY}`;

  protected readonly isBrowser = this.platformService.isBrowser();

  // ✅ INPUTS : Reçoit les données du parent
  readonly stations = input.required<any>();
  readonly initialCenter = input<[number, number]>();
  readonly initialSearch = input<string>();

  protected readonly filterValue = signal('');

  protected readonly filteredStations = computed(() => {
    const rawData = this.stations();
    let list: ChargingStationResponseDTO[] = [];

    if (rawData?.content && Array.isArray(rawData.content)) {
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
  center: LngLatLike = [4.8522, 45.7566]; // Lyon par défaut
  hoverStation?: ChargingStationResponseDTO;

  // Appelé quand la carte est PRÊTE
  onMapLoad(map: Map): void {
    this.map = map;
    this.applyNavigationState();
  }

  private applyNavigationState() {
    if (!this.map) return;

    const centerCoords = this.initialCenter();
    const searchTerm = this.initialSearch();

    // Cas 1 : On a des coordonnées (venant du dashboard)
    if (centerCoords) {
      this.map.flyTo({
        center: centerCoords, // Déjà au format [Lng, Lat] grâce au Dashboard
        zoom: 13,
        essential: true
      });

      if (searchTerm) this.filterValue.set(searchTerm);
    }
    // Cas 2 : Juste une recherche textuelle
    else if (searchTerm) {
      this.handleSearch(searchTerm);
    }
  }

  // ... (Garde tes méthodes onHover, onLeave, etc.)

  onLocalSearch(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    this.handleSearch(target.value || '');
  }

  private handleSearch(value: string) {
    this.filterValue.set(value);
    const filter = value.toLowerCase();

    // Si rien trouvé en local, on cherche via API
    if (filter.length > 2 && this.filteredStations().length === 0) {
      this.geolocService.searchCity(filter).subscribe(coords => {
        if (coords) {
          this.map?.flyTo({
            center: [coords.lng, coords.lat], // [Lng, Lat]
            zoom: 12,
            essential: true
          });
        }
      });
    } else if (this.filteredStations().length > 0) {
      // Si trouvé en local, on centre sur le premier
      this.centerMapOnStation(this.filteredStations()[0]);
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
    if (data) this.handleSearch(data);
  }

  private centerMapOnStation(station: ChargingStationResponseDTO): void {
    const lng = Number(station.lng) || 0;
    const lat = Number(station.lat) || 0;
    if (lng === 0 && lat === 0) return;

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
