import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_OWNER')) {
      this.router.navigate(['/user/select-role']);
    }
  }

  goToLocations() {
    this.router.navigate(['/owner/locations']);
  }

  goToStations() {
    this.router.navigate(['/owner/stations']);
  }

  goToAvailabilityRules() {
    this.router.navigate(['/owner/availability-rules']);
  }

  goToBookings() {
    this.router.navigate(['/owner/bookings']);
  }
}
