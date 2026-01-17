import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // + RouterLink
import { CommonModule } from '@angular/common'; // + CommonModule (pour titlecase)
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UserService } from '../../service/user.service';
import { RoleSelectorComponent } from '../../components/role-selector/role-selector.component';
import { IonContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { PlatformService } from 'src/app/core/services/platform.service';
import { addIcons } from 'ionicons'; // + addIcons
import { shieldCheckmarkOutline, helpBuoyOutline, flashOutline, arrowBackOutline, addCircleOutline, cashOutline, calendarOutline, mapOutline, timeOutline, listOutline, headsetOutline } from 'ionicons/icons'; // + Icons
import { UserProfileDto } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ IonContent, RoleSelectorComponent, CommonModule, IonIcon, RouterLink], // Ajoute les modules ici
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  public authService = inject(AuthService);
  private userService = inject(UserService);
  private platformService = inject(PlatformService);
  user = signal<UserProfileDto | null>(null);

  constructor() {
    addIcons({shieldCheckmarkOutline,headsetOutline,mapOutline,arrowBackOutline,addCircleOutline,cashOutline,calendarOutline,timeOutline,listOutline,helpBuoyOutline,flashOutline});
  }

  ngOnInit() {}

  onRoleSelected(roleName: string) {
    const currentUser = this.authService.user();
    if (!currentUser) return;

    if (this.authService.hasRole(roleName)) {
        this.navigateByRole(roleName);
        return;
    }

    this.userService.addRole(currentUser.id, roleName).subscribe({
      next: () => {
        this.authService.fetchCurrentUser().subscribe(() => {
           this.navigateByRole(roleName);
        });
      },
      error: (err) => console.error(err)
    });
  }

  private navigateByRole(roleName: string) {
    const basePath = this.platformService.isMobile() ? '/tabs/user' : '/user';
    if (roleName === 'OWNER') {
      this.router.navigate([`${basePath}/owner/dashboard`]);
    } else if (roleName === 'RENTER') {
      this.router.navigate([`${basePath}/renter/dashboard`]);
    }
  }
}
