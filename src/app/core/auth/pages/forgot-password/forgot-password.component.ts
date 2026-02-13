import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { AuthService } from '../../services/auth.service';
import { PlatformService } from '../../services/platform.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonCardContent,
  IonTitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonContent,
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    RouterModule,
    IonButton,
    IonSpinner,
    IonToolbar,
    IonHeader,
    IonTitle,
  ],
})
export class ForgotPasswordComponent {
  ControlType: typeof ControlType = ControlType;
  router = inject(Router);
  authservice = inject(AuthService);
  platformService = inject(PlatformService);
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authservice.resetPassword(this.email.value).subscribe({
        next: (response) => {
          this.successMessage = 'Veuillez verifier votre adresse mail.';
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur de connexion :', err);
          this.isLoading = false;
          this.errorMessage =
            'Erreur lors de la réinitialisation du mot de passe.';
        },
      });
    }
  }

  get email(): FormControl {
    return this.forgotPasswordForm.get('email') as FormControl;
  }
}
