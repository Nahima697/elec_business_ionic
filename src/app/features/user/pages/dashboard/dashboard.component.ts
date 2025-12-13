import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // + RouterLink
import { CommonModule } from '@angular/common'; // + CommonModule (pour titlecase)
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UserService } from '../../service/user.service';
import { RoleSelectorComponent } from '../../components/role-selector/role-selector.component';
import { IonContent, IonIcon } from "@ionic/angular/standalone";
import { PlatformService } from 'src/app/shared-component/services/platform.service';
import { addIcons } from 'ionicons'; // + addIcons
import { shieldCheckmarkOutline, helpBuoyOutline, flashOutline } from 'ionicons/icons'; // + Icons

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IonContent, RoleSelectorComponent, CommonModule, IonIcon, RouterLink], // Ajoute les modules ici
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  // On met authService en public pour l'utiliser dans le HTML (ou protected)
  public authService = inject(AuthService);
  private userService = inject(UserService);
  private platformService = inject(PlatformService);

  constructor() {
    // On charge les icônes de la page
    addIcons({ shieldCheckmarkOutline, helpBuoyOutline, flashOutline });
  }

  ngOnInit() {}

  onRoleSelected(roleName: string) {
    // ... (Ton code existant pour la redirection) ...
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
