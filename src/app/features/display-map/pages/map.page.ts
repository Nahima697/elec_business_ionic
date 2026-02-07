import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { DisplayMapComponent } from '../components/display-map/display-map.component';
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';

@Component({
  selector: 'app-map',
  template: `
    <ion-content [fullscreen]="true">
      @if (stations.isLoading()) {
        <div class="spinner-container">
          <ion-spinner></ion-spinner>
        </div>
      } @else if (stations.hasValue()) {
        <app-display-map
          [stations]="stations.value()!"
          [initialCenter]="centerFromNav"
          [initialSearch]="searchFromNav">
        </app-display-map>
      }
    </ion-content>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `],
  standalone: true,
  imports: [DisplayMapComponent, IonContent, IonSpinner]
})
export class MapPage {
  private stationService = inject(StationApiService);
  private router = inject(Router);

  readonly stations = this.stationService.getAll();

  // On stocke ici pour passer au template
  centerFromNav: [number, number] | undefined;
  searchFromNav: string | undefined;

  constructor() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { center?: [number, number], searchTerm?: string };

    if (state) {
      this.centerFromNav = state.center;
      this.searchFromNav = state.searchTerm;
    }
  }
}
