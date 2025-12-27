import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // <--- AJOUT
import {
  IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendar, card, checkmarkCircle, chevronForward,
  navigate, search, time, map, arrowBackOutline // <--- AJOUT
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
  private location = inject(Location); // <--- AJOUT

  constructor() {
    addIcons({
      calendar, navigate, search, time, checkmarkCircle,
      chevronForward, card, map, arrowBackOutline // <--- AJOUT
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

  searchStation(term: string) {
    if (!term || term.trim() === '') return;
    this.router.navigate(['/map'], { state: { searchTerm: term } });
  }

  goToMyBookings() {
    this.router.navigate(['user/renter/bookings']);
  }
}
