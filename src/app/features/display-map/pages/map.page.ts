import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner,IonFooter } from '@ionic/angular/standalone';
import { DisplayMapComponent } from '../components/display-map/display-map.component';
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';
import { HeaderComponent } from 'src/app/shared-component/header/header.component';
import { FooterComponent } from 'src/app/shared-component/footer/footer.component';
@Component({
  selector: 'app-map',
  template: `
  <app-header class="ion-hide-md-down" [stations]="stations.error() ? [] : (stations.value() ?? [])"
    [(open)]="openMenuMobile"></app-header>
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
    <ion-footer class="ion-hide-md-down">
      <app-footer></app-footer>
    </ion-footer>
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
  imports: [DisplayMapComponent, IonContent, IonSpinner,HeaderComponent, FooterComponent,IonFooter]
})
export class MapPage {
  private stationService = inject(StationApiService);
  private router = inject(Router);
  protected readonly openMenuMobile= signal(false);

  readonly stations = this.stationService.getAll();

  // On stocke ici pour passer au template
  centerFromNav: [number, number] | undefined;
  searchFromNav: string | undefined;

  constructor() {
    // On capture l'état pendant la navigation (C'est le SEUL endroit fiable)
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { center?: [number, number], searchTerm?: string };

    if (state) {
      this.centerFromNav = state.center;
      this.searchFromNav = state.searchTerm;
    }
  }
}
