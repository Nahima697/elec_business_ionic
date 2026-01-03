import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GeolocalisationService } from 'src/app/features/display-map/service/geolocalisation.service';
import {
  IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonIcon, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendar, card, checkmarkCircle, chevronForward,
  navigate, search, time, map, arrowBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-renter-dashboard',
  standalone: true,
  imports: [IonContent, IonIcon],
  templateUrl: './renter-dashboard.component.html',
  styleUrls: ['./renter-dashboard.component.scss']
})
export class RenterDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private location = inject(Location);
  private geolocService = inject(GeolocalisationService);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({
      calendar, navigate, search, time, checkmarkCircle,
      chevronForward, card, map, arrowBackOutline
    });
  }

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_RENTER')) {
      this.router.navigate(['/user/select-role']);
    }
  }

  goBack() {
    this.location.back();
  }


  async searchStation(term: string) {
    if (!term || term.trim() === '') return;

    // 1. Afficher un chargement
    const loading = await this.loadingCtrl.create({
      message: 'Recherche de la destination...',
      duration: 5000
    });
    await loading.present();

    // 2. Appel au service de géolocalisation
    this.geolocService.searchCity(term).subscribe({
      next: async (coords) => {
        await loading.dismiss();

        if (coords) {
          // CAS A : On a trouvé des coordonnées -> On les envoie à la map
          this.router.navigate(['/map'], {
            state: {
              center: [coords.lng, coords.lat],
              searchTerm: term
            }
          });
        } else {
          // CAS B : Rien trouvé -> On envoie juste le terme (la map cherchera dans les bornes locales)
          this.router.navigate(['/map'], { state: { searchTerm: term } });

          // Petit toast informatif
          const toast = await this.toastCtrl.create({
            message: 'Adresse non trouvée sur la carte globale, recherche locale...',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        }
      },
      error: async () => {
        await loading.dismiss();
        this.router.navigate(['/map'], { state: { searchTerm: term } });
      }
    });
  }

  goToMyBookings() {
    this.router.navigate(['user/renter/bookings']);
  }
}
