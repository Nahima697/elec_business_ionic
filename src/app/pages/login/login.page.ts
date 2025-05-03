import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,FormGroup,Validators, FormControl } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem,
  IonList,IonButton, IonCardHeader,IonCard,IonCardTitle,IonCardSubtitle,IonCardContent } from '@ionic/angular/standalone';
import { FormFieldComponent } from 'src/app/sharedComponent/form-field/form-field.component';
import { ControlType } from 'src/app/sharedComponent/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,

  imports: [IonCardHeader, IonContent, IonHeader,
    IonTitle, IonToolbar,IonItem,IonList,
    IonButton,IonCard,IonCardHeader,IonCardTitle,IonCardSubtitle,IonCardTitle,IonCardContent,
    CommonModule, FormsModule,ReactiveFormsModule,FormFieldComponent,ReactiveFormsModule,RouterModule,RouterModule]
})
export class LoginPage  {
ControlType: typeof ControlType = ControlType;
router = inject(Router);

loginForm = new FormGroup({
  email: new FormControl('',{ validators: [Validators.required, Validators.email]}),
  password: new FormControl('',{ validators: [Validators.required] })
})

onSubmit() {
  if (this.loginForm.valid) {
    console.log('Formulaire envoyé :', this.loginForm.value);
    this.router.navigateByUrl('/tabs', { replaceUrl: true });

  }
}
get email(): FormControl {
  return this.loginForm.get('email') as FormControl;
}

get password(): FormControl {
  return this.loginForm.get('password') as FormControl;
}
}

