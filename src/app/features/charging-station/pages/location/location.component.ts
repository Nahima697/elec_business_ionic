import { Component, effect, inject, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ChargingLocation } from 'src/app/features/charging-station/models/charging-location.model';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';
import { ChargingLocationService } from 'src/app/features/charging-station/services/charging-location.service';
import { ChargingStationService } from 'src/app/features/charging-station/services/charging-station.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { LocationFormComponent } from '../../component/location-form/location-form.component';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardContent, IonCardTitle, IonList, IonItem,
  IonLabel, IonThumbnail, IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  standalone: true,
  imports: [
    IonButton, IonLabel, IonItem, IonList, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, IonContent, IonHeader,
    IonTitle, IonToolbar, IonThumbnail,
    RouterLink,
    LocationFormComponent
  ]
})
export class LocationComponent implements OnInit {

  private chargingLocationService = inject(ChargingLocationService);
  private chargingStationService = inject(ChargingStationService);
  private authService = inject(AuthService);

  isLoading = false;
  locations: ChargingLocation[] = [];
  stationsByLocation: Record<string, ChargingStationResponseDTO[] | undefined> = {};
  user = this.authService.user;

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.loadLocations();
      }
    });
  }

  ngOnInit(): void {
    if (this.user()) {
      this.loadLocations();
    }
  }

  loadLocations(): void {
    this.isLoading = true;
    this.chargingLocationService.getLocationByUser().subscribe({
      next: (locations) => {
        this.locations = locations;
        locations.forEach(loc => {
          if (loc.id) {
            this.chargingStationService.getStationsByLocationId(loc.id)
              .subscribe(stations => this.stationsByLocation[loc.id] = stations);
          }
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
        this.isLoading = false;
      }
    });
  }
}
