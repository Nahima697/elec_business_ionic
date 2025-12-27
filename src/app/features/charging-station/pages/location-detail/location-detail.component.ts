import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChargingLocation } from '../../models/charging-location.model';
import { ChargingStationResponseDTO } from '../../models/charging-station.model';
import { ChargingLocationService } from '../../services/charging-location.service';
import { ChargingStationService } from '../../services/charging-station.service'; // <--- Ajout du service Station
import {
  IonCard, IonButton, IonTitle, IonHeader, IonContent,
  IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonToolbar, IonIcon, IonList, IonItem, IonLabel, IonSpinner, IonThumbnail, IonButtons } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowBackOutline, addCircleOutline, flashOutline, mapOutline } from 'ionicons/icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss'],
  standalone: true,
  imports: [IonButtons,
    IonCardTitle, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard,
    IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonIcon,
    IonList, IonItem, IonLabel, IonSpinner, IonThumbnail,
    RouterLink
  ]
})
export class LocationDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private locationNav = inject(Location);
  private chargingLocationService = inject(ChargingLocationService);
  private chargingStationService = inject(ChargingStationService);

  location = signal<ChargingLocation | undefined>(undefined);
  stations = signal<ChargingStationResponseDTO[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    addIcons({arrowBackOutline,mapOutline,addCircleOutline,flashOutline});
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: string) {
    this.isLoading.set(true);

    // 1. Récupérer le Lieu
    this.chargingLocationService.getChargingLocationDetail(id).subscribe({
      next: (loc) => {
        this.location.set(loc);

        // 2. Une fois le lieu chargé, on récupère ses stations
        this.chargingStationService.getStationsByLocationId(id).subscribe({
          next: (stationsList) => {
            this.stations.set(stationsList);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    this.locationNav.back();
  }
}
