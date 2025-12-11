import { Component, inject, signal, computed } from '@angular/core';
import { ChargingStationService } from '../../services/charging-station.service';
import { StationListComponent } from '../../component/station-list/station-list.component';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filterOutline } from 'ionicons/icons';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonButton, IonIcon,
    StationListComponent
  ],
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage {
  private stationService = inject(ChargingStationService);

  // 1. Ressource complète des stations
  allStationsResource = this.stationService.getChargingStations();

  // 2. Terme de recherche
  searchTerm = signal<string>('');

  // 3. Liste filtrée (Calculée dynamiquement)
  filteredStations = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const stations = this.allStationsResource.value() || [];

    if (!term) return stations;

    return stations.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.locationDTO?.city.toLowerCase().includes(term)
    );
  });

  constructor() {
    addIcons({ filterOutline });
  }

  onSearch(event: any) {
    this.searchTerm.set(event.detail.value);
  }
}
