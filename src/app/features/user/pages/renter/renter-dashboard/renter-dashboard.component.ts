import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar, card, checkmarkCircle, chevronForward, navigate, search} from 'ionicons/icons';
import { time, map } from 'ionicons/icons';
@Component({
  selector: 'app-renter-dashboard',
  standalone: true,
  imports: [
    IonContent,
    IonIcon
  ],
  templateUrl: './renter-dashboard.component.html',
  styleUrls: ['./renter-dashboard.component.scss']
})
export class RenterDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Empêche un propriétaire de venir ici
    if (!this.auth.hasRole('ROLE_RENTER')) {
      this.router.navigate(['/user/select-role']);
    }
  }
  constructor() {
    addIcons({ calendar, navigate, search, time, checkmarkCircle, chevronForward, card, map });
  }

  searchStation(term: string) {
    if (!term || term.trim() === '') return;

    // On redirige vers la carte en passant le terme de recherche
    this.router.navigate(['/map'], {
      state: { searchTerm: term }
    });
  }

  goToMyBookings() {
    this.router.navigate(['user/renter/bookings']);
  }

  goToHistory() {
    this.router.navigate(['user/renter/history']);
  }

  goToFavorites() {
    this.router.navigate(['user/renter/favorites']);
  }
}
