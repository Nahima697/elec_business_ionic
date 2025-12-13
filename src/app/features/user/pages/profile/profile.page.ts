import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonSpinner
} from '@ionic/angular/standalone';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonSpinner,
  ],
})
export class ProfilePage implements OnInit {

  private auth = inject(AuthService);

  userSignal = this.auth.user;

  ControlType = ControlType;
  isLoading = true;
  isSaving = false;

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    phoneNumber: new FormControl('')
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.auth.fetchCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.form.patchValue({
            username: user.username,
          });
        }
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

 save() {
  if (this.form.invalid) return;

  this.isSaving = true;

  const payload = {
    ...this.form.getRawValue(),
    username: this.form.value.username?? undefined,
  };

  this.auth.updateProfile(payload).subscribe({
    next: () => (this.isSaving = false),
    error: () => (this.isSaving = false),
  });
}

  logout() {
    this.auth.logout();
  }
}
