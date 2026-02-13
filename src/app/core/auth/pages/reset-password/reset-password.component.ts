import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { AuthService } from '../../services/auth.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCardContent,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCardContent,
    IonButton,
    IonSpinner,
    FormFieldComponent,
  ],
})
export class ResetPasswordComponent implements OnInit {
  ControlType: typeof ControlType = ControlType;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  userId!: string;
  token!: string;

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  resetPasswordForm = new FormGroup(
    {
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('t');

    if (!userId || !token) {
      this.errorMessage = 'Lien invalide ou expiré.';
      return;
    }

    this.userId = userId;
    this.token = token;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');

    if (!password || !confirm) return null;

    return password.value === confirm.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.authService
      .confirmResetPassword(this.userId, this.token, this.password.value!)
      .subscribe({
        next: () => {
          this.successMessage = 'Mot de passe modifié avec succès.';
          this.isLoading = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: () => {
          this.errorMessage = 'Lien invalide ou expiré.';
          this.isLoading = false;
        },
      });
  }

  get password() {
    return this.resetPasswordForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword') as FormControl;
  }
}
