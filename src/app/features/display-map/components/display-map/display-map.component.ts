import { Component, inject, OnInit, signal, computed, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { LngLatLike, Map } from 'maplibre-gl';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { IonIcon, ModalController,} from '@ionic/angular/standalone';
import { FilterModalComponent } from 'src/app/shared-component/filter-modal/filter-modal.component';
import { PlatformService } from 'src/app/shared-component/services/platform.service';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';

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
  readonly stations = input.required<ChargingStationResponseDTO[]>();

  protected readonly filterValue = signal('');
  protected readonly filteredStations = computed(() => {
    const list = this.stations();
    if (!list) return [];

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
  ControlType = ControlType;

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Gestion de l'état passé via le router (si on vient d'une recherche précédente)
    const state = this.router.getCurrentNavigation()?.extras?.state as { filteredStations?: ChargingStationResponseDTO[] };

    if (state?.filteredStations?.length) {
      setTimeout(() => {
        const firstStation = state.filteredStations![0];
        this.filterValue.set(firstStation.name);
        this.centerMapOnStation(firstStation);
      }, 500); // Petit délai pour laisser la map charger
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
