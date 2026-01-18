import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonCard, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carSportOutline, timeOutline, listOutline, flashOutline } from 'ionicons/icons';

// Services
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UserService } from 'src/app/features/user/service/user.service';
import { AppNavigationService } from 'src/app/core/services/app-navigation.service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardContent, IonIcon
  ]
})
export class BookingPageComponent {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private navService = inject(AppNavigationService);

  constructor() {
    addIcons({ carSportOutline, flashOutline, timeOutline, listOutline });
  }

  onSelectContext(roleName: 'RENTER' | 'OWNER') {
    const currentUser = this.authService.user();
    if (!currentUser) return;

    if (this.authService.hasRole(roleName)) {
        this.navigateByRole(roleName);
    } else {
        this.userService.addRole(currentUser.id, roleName).subscribe({
          next: () => {
            this.authService.fetchCurrentUser().subscribe(() => {
               this.navigateByRole(roleName);
            });
          },
          error: (err) => console.error('Erreur lors de l\'ajout du rôle', err)
        });
    }
  }

  private navigateByRole(roleName: string) {
    if (roleName === 'OWNER') {
      this.navService.go(['user', 'owner', 'bookings']);
    } else if (roleName === 'RENTER') {
      this.navService.go(['user', 'renter', 'bookings']);
    }
  }
}
