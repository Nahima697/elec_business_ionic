import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Location } from '@angular/common';
import { GeolocalisationService } from 'src/app/features/display-map/service/geolocalisation.service';
import { IonContent, IonIcon, LoadingController, ToastController, IonBackButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar, card, checkmarkCircle, chevronForward, navigate, search, time, map, arrowBackOutline } from 'ionicons/icons';
import { UserProfileDto } from '../../../models/user.model';
import { AppNavigationService } from 'src/app/core/services/app-navigation.service';

@Component({
  selector: 'app-renter-dashboard',
  standalone: true,
  imports: [IonBackButton, IonContent, IonIcon],
  templateUrl: './renter-dashboard.component.html',
  styleUrls: ['./renter-dashboard.component.scss']
})
export class RenterDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private location = inject(Location);
  private geolocService = inject(GeolocalisationService);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);
  private navService = inject(AppNavigationService);

  protected user = signal<UserProfileDto | null>(null);

  constructor() {
    addIcons({ calendar, navigate, search, time, checkmarkCircle, chevronForward, card, map, arrowBackOutline });
  }

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_RENTER')) {
      this.navService.go(['user', 'select-role']);
    }
  }

  goBack() {
    this.location.back();
  }

  async searchStation(term: string) {
    if (!term || term.trim() === '') return;

    const loading = await this.loadingCtrl.create({
      message: 'Recherche de la destination...',
      duration: 3000
    });
    await loading.present();

    this.geolocService.searchCity(term).subscribe({
      next: async (coords) => {
        await loading.dismiss();

        if (coords) {
          this.navService.go(['map'], {
            state: {
              center: [coords.lng, coords.lat],
              searchTerm: term
            }
          });
        } else {
          this.navService.go(['map'], { state: { searchTerm: term } });

          const toast = await this.toastCtrl.create({
            message: 'Adresse non trouvée, recherche locale...',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        }
      },
      error: async () => {
        await loading.dismiss();
        this.navService.go(['map'], { state: { searchTerm: term } });
      }
    });
  }

  goToProfile() { this.navService.go('profile'); }
  goToMyBookings() { this.navService.go(['user', 'renter', 'bookings']); }
  goToMap() { this.navService.go('map'); }
}
