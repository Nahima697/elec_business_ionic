import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonIcon, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline, mapOutline, listOutline,
  timeOutline, statsChartOutline, storefrontOutline
} from 'ionicons/icons';

import { LocationFormComponent } from 'src/app/features/charging-station/component/location-form/location-form.component';
import { StationFormComponent } from 'src/app/features/charging-station/component/station-form/station-form.component';
import { AvailabilityRulesComponent } from 'src/app/features/charging-station/pages/availability-rules/availability-rules.component';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    IonContent, IonButton, IonIcon,

  ],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController); // <--- Le contrôleur de modale

  constructor() {
    addIcons({
      addCircleOutline, mapOutline, listOutline,
      timeOutline, statsChartOutline, storefrontOutline
    });
  }

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_OWNER')) {
      this.router.navigate(['/user']);
    }
  }

  // --- 1. AJOUTER UN LIEU (Adresse) ---
  async openAddLocationModal() {
    const modal = await this.modalCtrl.create({
      component: LocationFormComponent,
      componentProps: {
      }
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log('Lieu ajouté avec succès !');
    }
  }

  // --- 2. AJOUTER UNE STATION --
  async openAddStationModal() {
    const modal = await this.modalCtrl.create({
      component: StationFormComponent,
    });
    await modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log('Station ajoutée !');
    }
  }

  // --- 3. GÉRER LES DISPONIBILITÉS ---
  async openAvailabilityModal() {
    const modal = await this.modalCtrl.create({
      component: AvailabilityRulesComponent
    });
    await modal.present();
  }

  goToMyBookings() {
    this.router.navigate(['/user/owner/bookings']);
  }
}

