import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormGroup,Validators, FormControl, Form } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton, IonCardContent, IonItem, IonCheckbox, IonLabel } from '@ionic/angular/standalone';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonLabel, IonCheckbox, IonItem, IonContent, IonHeader,IonItem,
    IonTitle, IonToolbar,
    IonButton,IonCardContent,
    CommonModule, FormsModule,ReactiveFormsModule,FormFieldComponent,ReactiveFormsModule,RouterModule,RouterModule]
})
export class RegisterPage  {

ControlType: typeof ControlType = ControlType;
router = inject(Router);
authservice=inject(AuthService);

registerForm = new FormGroup({
  username: new FormControl('',{ validators: [Validators.required]}),
  email: new FormControl('',{ validators: [Validators.required,Validators.email] }),
  password: new FormControl('',{ validators: [Validators.required] }),

})

onSubmit() {
  if (this.registerForm.valid) {
    this.authservice.register(this.username.value, this.email.value, this.password.value).subscribe({
      next: (response) => {
        console.log('Inscription réussie :', response);

        if (response.emailVerificationRequired) {
          this.router.navigate(['/verify-email-info'], {
            queryParams: { email: this.email.value }
          });
        } else {
          this.router.navigate(['/tabs']);
        }
      },
      error: (err) => {
        console.error('Erreur d’inscription :', err);
      }
    });
  }
}

get username(): FormControl {
  return this.registerForm.get('username') as FormControl;
}

get email():FormControl {
  return this.registerForm.get('email') as FormControl;
}
get password(): FormControl {
  return this.registerForm.get('password') as FormControl;
}

}
