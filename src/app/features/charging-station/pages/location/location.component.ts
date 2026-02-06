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
  IonLabel, IonThumbnail, IonButton,IonBackButton,IonButtons, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, addCircleOutline } from 'ionicons/icons';
import { ModalController } from '@ionic/angular/standalone';
import { StationFormComponent } from '../../component/station-form/station-form.component';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  standalone: true,
  imports: [IonIcon,
    IonButton, IonLabel, IonItem, IonList, IonCardTitle, IonCardContent,
    IonCardSubtitle, IonCardHeader, IonCard, IonContent, IonHeader,
    IonTitle, IonToolbar, IonThumbnail,IonBackButton,IonButtons,
    RouterLink
  ]
})
export class LocationComponent implements OnInit {

  private chargingLocationService = inject(ChargingLocationService);
  private chargingStationService = inject(ChargingStationService);
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);

  isLoading = false;
  locations: ChargingLocation[] = [];
  stationsByLocation: Record<string, ChargingStationResponseDTO[] | undefined> = {};
  user = this.authService.user;

  constructor() {
    addIcons({addOutline,addCircleOutline});

    // Recharger les lieux lorsque l'utilisateur change (login/logout)
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

  async openAddLocationModal() {
    const modal = await this.modalCtrl.create({
      component: LocationFormComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.role === 'confirm') {
        this.loadLocations();
      }
    });

    await modal.present();
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

async openAddStationModal(locationId: string) {
    const modal = await this.modalCtrl.create({
      component: StationFormComponent,
      componentProps: {
        locationId: locationId
      }
    });

    await modal.present();
    modal.onDidDismiss().then(() => {
      this.loadLocations();
    });
  }
}

