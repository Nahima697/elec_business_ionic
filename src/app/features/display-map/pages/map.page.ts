import { Component, inject } from '@angular/core';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { DisplayMapComponent } from '../components/display-map/display-map.component';// Vérifie le chemin
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
        <app-display-map [stations]="stations.value()!"></app-display-map>
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
  readonly stations = this.stationService.getAll();
}
