import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Pour le retour arrière
import {
  IonContent, IonButton, IonIcon, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline, mapOutline, listOutline,
  timeOutline, statsChartOutline, storefrontOutline,
  arrowBackOutline, flashOutline // <--- AJOUTS
} from 'ionicons/icons';

import { LocationFormComponent } from 'src/app/features/charging-station/component/location-form/location-form.component';
import { StationFormComponent } from 'src/app/features/charging-station/component/station-form/station-form.component';
import { AvailabilityRulesComponent } from 'src/app/features/charging-station/component/availability-rules/availability-rules.component';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location); // <--- Injection Location
  private modalCtrl = inject(ModalController);

  constructor() {
    addIcons({
      addCircleOutline, mapOutline, listOutline,
      timeOutline, statsChartOutline, storefrontOutline,
      arrowBackOutline, flashOutline // <--- Enregistrement des icones
    });
  }

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_OWNER')) {
      this.router.navigate(['/user']);
    }
  }

  goBack() {
    this.location.back();
  }

  goToMyLocations() {
  this.router.navigate(['/user/owner/locations']);
}

  goToMyBookings() {
    this.router.navigate(['/user/owner/bookings']);
  }

  // --- MODALS ---
  async openAddLocationModal() {
    const modal = await this.modalCtrl.create({ component: LocationFormComponent });
    await modal.present();
  }

  async openAddStationModal() {
    const modal = await this.modalCtrl.create({ component: StationFormComponent });
    await modal.present();
  }

  async openAvailabilityModal() {
    const modal = await this.modalCtrl.create({ component: AvailabilityRulesComponent });
    await modal.present();
  }
}
