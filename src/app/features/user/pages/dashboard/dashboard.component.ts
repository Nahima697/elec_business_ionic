import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { UserService } from '../../service/user.service'; // Ton user service
import { RoleSelectorComponent } from '../../components/role-selector/role-selector.component';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // N'oublie pas d'importer ton RoleSelector ici
  imports: [IonContent, RoleSelectorComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  ngOnInit() {}

  onRoleSelected(roleName: string) {
    // 1. Récupérer l'utilisateur actuel
    const currentUser = this.authService.user();

    if (!currentUser) {
      console.error('Aucun utilisateur connecté');
      return;
    }

    // 2. Vérifier si l'utilisateur a déjà ce rôle (pour éviter l'appel API inutile)
    if (this.authService.hasRole(roleName)) {
        this.navigateByRole(roleName);
        return;
    }

    // 3. Appel API pour ajouter le rôle
    this.userService.addRole(currentUser.id, roleName).subscribe({
      next: () => {
        console.log(`Rôle ${roleName} ajouté avec succès`);

        // 4. IMPORTANT : Rafraîchir l'utilisateur localement pour avoir le nouveau rôle dans le AuthService
        this.authService.fetchCurrentUser().subscribe(() => {
           // 5. Redirection une fois que tout est à jour
           this.navigateByRole(roleName);
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du rôle', err);
            }
    });
  }

  private navigateByRole(roleName: string) {
    if (roleName === 'OWNER') {
      this.router.navigate(['/user/owner/dashboard']);
    } else if (roleName === 'RENTER') {
      this.router.navigate(['/user/renter/dashboard']);
    }
  }
}
