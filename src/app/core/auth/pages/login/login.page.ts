import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCardContent, IonSpinner } from '@ionic/angular/standalone'; // <--- AJOUT IonSpinner
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PlatformService } from 'src/app/shared-component/services/platform.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCardContent, IonSpinner, CommonModule, FormsModule, ReactiveFormsModule, FormFieldComponent, RouterModule]
})
export class LoginPage {
  ControlType: typeof ControlType = ControlType;
  router = inject(Router);
  authservice = inject(AuthService);
  platformService = inject(PlatformService);

  // Gestion de l'état de chargement et des erreurs
  isLoading = false;
  errorMessage: string | null = null;

  loginForm = new FormGroup({
    username: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] })
  })

  onSubmit() {
    if (this.loginForm.valid) {
      // 1. On active le chargement et on reset l'erreur
      this.isLoading = true;
      this.errorMessage = null;

      this.authservice.login(this.username.value, this.password.value).subscribe({
        next: (response) => {
          console.log('Connexion réussie :', response);
          // Le loading reste true jusqu'à la navigation pour éviter le "flickering"
          if (this.platformService.isDesktop()) {
            this.router.navigateByUrl('/user/dashboard', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('/tabs/user/dashboard', { replaceUrl: true });
          }
        },
        error: (err) => {
          console.error('Erreur de connexion :', err);
          // 2. On arrête le chargement et on affiche l'erreur
          this.isLoading = false;
          // Tu peux personnaliser le message selon le code erreur (401, 500, etc.)
          this.errorMessage = "Identifiant ou mot de passe incorrect.";
        }
      });
    }
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
