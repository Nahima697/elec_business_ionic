import { Component, inject, OnInit, signal, computed, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { LngLatLike, Map } from 'maplibre-gl';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { IonIcon, ModalController,} from '@ionic/angular/standalone';
import { FilterModalComponent } from 'src/app/shared-component/filter-modal/filter-modal.component';
import { PlatformService } from 'src/app/shared-component/services/platform.service';
import { ChargingStationPage, ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';

@Component({
  selector: 'app-display-map',
  standalone: true,
  imports: [
    RouterModule,
    NgxMapLibreGLModule,
    FormFieldComponent,
    IonIcon
  ],
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.scss'],
})
export class DisplayMapComponent implements OnInit {
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private platformService = inject(PlatformService);

  // Variables
  protected readonly isBrowser = this.platformService.isBrowser();
  readonly stations = input.required<ChargingStationPage>();

  protected readonly filterValue = signal('');
  protected readonly filteredStations = computed(() => {
    const rawData = this.stations();

    // 1. EXTRACTION DES DONNÉES (Le correctif est ici)
    let list: ChargingStationResponseDTO[] = [];

    if (!rawData) {
      list = [];
    }
    // Si c'est l'objet Paginé de Spring Boot (ce que tu reçois)
    else if (rawData.content && Array.isArray(rawData.content)) {
      list = rawData.content;
    }
    // Si c'est déjà un tableau (cas normal)
    else if (Array.isArray(rawData)) {
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

    // Récupération de l'état (SearchTerm OU FilteredStations)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      filteredStations?: ChargingStationResponseDTO[],
      searchTerm?: string
    };

    if (state) {
      setTimeout(() => {
        // CAS 1 : On a reçu un terme de recherche
        if (state.searchTerm) {
          console.log('Recherche reçue du dashboard :', state.searchTerm);
          this.updateFilter(state.searchTerm);
        }
        // CAS 2 : On a reçu une liste déjà filtrée
        else if (state.filteredStations?.length) {
          const firstStation = state.filteredStations![0];
          this.filterValue.set(firstStation.name);
          this.centerMapOnStation(firstStation);
        }
      }, 500);
    }
  }

  onMapLoad(map: Map): void {
    this.map = map;
    // La géolocalisation est gérée par le template <mgl-control mglGeolocate>
  }

  onHover(station: ChargingStationResponseDTO): void {
    this.hoverStation = station;
  }

  onLeave(): void {
    this.hoverStation = undefined;
  }

  // Recherche via l'input texte
  onLocalSearch(event: Event) {
    const customEvent = event as CustomEvent;
    const value = (customEvent.detail.value as string) || '';
    this.updateFilter(value);
  }

  // Ouverture de la modale de filtre
  async openFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterModalComponent,
      initialBreakpoint: 0.45,
      breakpoints: [0, 0.25, 0.5, 0.75],
      cssClass: 'bottom-sheet',
    });

    await modal.present();

    // Récupération des données à la fermeture de la modale
    const { data } = await modal.onDidDismiss();

    if (data) {
      // Suppose que la modale renvoie une string ou un objet. Adapte selon ta logique.
      console.log('Filtre reçu de la modale:', data);
      this.updateFilter(data);
    }
  }

  private updateFilter(value: string) {
    this.filterValue.set(value);

    // Si on a des résultats, on centre sur le premier
    const results = this.filteredStations();
    if (results.length > 0) {
      this.centerMapOnStation(results[0]);
    }
  }

  private centerMapOnStation(station: ChargingStationResponseDTO): void {
    const lng = station.lng ?? 0;
    const lat = station.lat ?? 0;

    if (lng === 0 && lat === 0) return;

    this.center = [lng, lat];

    if (this.map) {
      this.map.flyTo({
        center: this.center,
        zoom: 15,
        essential: true
      });
    }
  }
}
