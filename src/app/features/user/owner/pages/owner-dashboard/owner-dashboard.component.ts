import { Component, OnInit, inject, viewChild } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, chevronDownCircleOutline } from 'ionicons/icons';
import { StationFormComponent } from 'src/app/features/charging-station/component/station-form/station-form.component';
@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonIcon,
    StationFormComponent
  ],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  protected auth = inject(AuthService);
  private router = inject(Router);

  // Pour contrôler l'accordéon (le fermer après création)
  accordionGroup = viewChild<IonAccordionGroup>('accordionGroup');

  constructor() {
    addIcons({ addCircleOutline, chevronDownCircleOutline });
  }

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_OWNER')) {
      this.router.navigate(['/user/select-role']);
    }
  }

  // Action quand la borne est créée via le formulaire enfant
  onStationCreated() {
    // On ferme l'accordéon
    this.accordionGroup()!.value = undefined;
    // Optionnel : Afficher un Toast ou recharger des données
  }

  goToLocations() { this.router.navigate(['/owner/locations']); }
  goToStations() { this.router.navigate(['/owner/stations']); }
  goToAvailabilityRules() { this.router.navigate(['/owner/availability-rules']); }
  goToBookings() { this.router.navigate(['user/owner/bookings']); }
}
