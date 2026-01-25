import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule, ReactiveFormsModule, FormGroup,
  Validators, FormControl, AbstractControl, ValidationErrors, ValidatorFn
} from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
  IonCardContent, IonItem, IonCheckbox, IonLabel, IonSpinner,
  ToastController 
} from '@ionic/angular/standalone';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
};

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonLabel, IonCheckbox, IonItem, IonContent, IonHeader, IonItem,
    IonTitle, IonToolbar, IonButton, IonCardContent, IonSpinner,
    CommonModule, FormsModule, ReactiveFormsModule, FormFieldComponent,
    ReactiveFormsModule, RouterModule
  ]
})
export class RegisterPage {

  ControlType: typeof ControlType = ControlType;
  router = inject(Router);
  authService = inject(AuthService); // J'ai renommé en camelCase standard
  toastCtrl = inject(ToastController); // <--- Injection du Toast

  isLoading = false;
  errorMessage: string | null = null;

  registerForm = new FormGroup({
    username: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { validators: [Validators.required] }),
    confirmPassword: new FormControl('', { validators: [Validators.required] }),
  }, { validators: passwordMatchValidator });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      // Utilisation de getRawValue pour être sûr d'avoir les strings
      const { username, email, password } = this.registerForm.getRawValue();

      if(username && email && password) {
        this.authService.register(username, email, password).subscribe({
          next: async (response) => {
            console.log('Inscription réussie :', response);
            this.isLoading = false;

            if (response.emailVerificationRequired) {
              // 1. Afficher un Toast de succès
              const toast = await this.toastCtrl.create({
                message: 'Compte créé ! Veuillez vérifier votre email pour l\'activer. 📧',
                duration: 4000,
                position: 'top',
                color: 'success',
                icon: 'mail-outline',
                buttons: [{ text: 'OK', role: 'cancel' }]
              });
              await toast.present();

              this.router.navigate(['/login']);
            } else {
              this.router.navigate(['/tabs']);
            }
          },
          error: (err) => {
            console.error('Erreur inscription :', err);
            this.isLoading = false;
            this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
          }
        });
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // Getters
  get username(): FormControl { return this.registerForm.get('username') as FormControl; }
  get email(): FormControl { return this.registerForm.get('email') as FormControl; }
  get password(): FormControl { return this.registerForm.get('password') as FormControl; }
  get confirmPassword(): FormControl { return this.registerForm.get('confirmPassword') as FormControl; }
}
