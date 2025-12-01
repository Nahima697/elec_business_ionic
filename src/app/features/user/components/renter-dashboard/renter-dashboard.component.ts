import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-renter-dashboard',
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
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

  goToMyBookings() {
    this.router.navigate(['/renter/bookings']);
  }

  goToHistory() {
    this.router.navigate(['/renter/history']);
  }

  goToFavorites() {
    this.router.navigate(['/renter/favorites']);
  }
}
