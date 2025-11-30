import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormGroup,Validators, FormControl } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,
  IonList,IonButton, IonCardHeader,IonCard,IonCardTitle,IonCardSubtitle,IonCardContent } from '@ionic/angular/standalone';
import { FormFieldComponent } from 'src/app/sharedComponent/form-field/form-field.component';
import { ControlType } from 'src/app/sharedComponent/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PlatformService } from 'src/app/sharedComponent/services/platform.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,

  imports: [ IonContent, IonHeader,
    IonTitle, IonToolbar,
    IonButton,IonCardContent,
    CommonModule, FormsModule,ReactiveFormsModule,FormFieldComponent,RouterModule,RouterModule]
})
export class LoginPage  {
ControlType: typeof ControlType = ControlType;
router = inject(Router);
authservice=inject(AuthService);
platformService = inject(PlatformService);

loginForm = new FormGroup({
  username: new FormControl('',{ validators: [Validators.required]}),
  password: new FormControl('',{ validators: [Validators.required] })
})

onSubmit() {
  if (this.loginForm.valid) {

    this.authservice.login(this.username.value,this.password.value).subscribe({
      next: (response) => {
        console.log('Connexion réussie :', response);
        if(this.platformService.isDesktop()) {
          this.router.navigateByUrl('/map', { replaceUrl: true });
        }
          this.router.navigateByUrl('/tabs/map', { replaceUrl: true });
      },
      error: (err) => {
        console.error('Erreur de connexion :', err);

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

