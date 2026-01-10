import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileService } from '../../service/user-profile.service';
import { UserProfileDto } from '../../models/user-profile.model';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon,
  IonAvatar, IonItem, IonLabel, IonInput, IonList, IonItemDivider,
  IonSpinner, ToastController, IonButtons, IonBackButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, saveOutline, logOutOutline, cameraOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon,
    IonAvatar, IonItem, IonLabel, IonInput,
    IonSpinner, IonButtons, IonBackButton
  ]
})
export class ProfilePage implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(UserProfileService);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);

  profileForm!: FormGroup;
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  user = signal<UserProfileDto | null>(null);

  constructor() {
    addIcons({ personCircleOutline, saveOutline, logOutOutline, cameraOutline });
  }

  ngOnInit() {
    this.initForm();
    this.loadProfile();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // Email souvent non modifiable directement

      // Adresse
      addressLine: [''],
      city: [''],
      postalCode: [''],
      country: ['']
    });
  }

  loadProfile() {
    this.isLoading.set(true);
    this.profileService.getMyProfile().subscribe({
      next: (data) => {
        this.user.set(data);
        this.profileForm.patchValue(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement profil', err);
        this.showToast('Impossible de charger le profil', 'danger');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      const updatedProfile: UserProfileDto = {
        ...this.user()!,
        ...this.profileForm.getRawValue()
      };

      this.profileService.updateMyProfile(updatedProfile).subscribe({
        next: (response) => {
          this.user.set(response);
          this.showToast('Profil mis à jour avec succès', 'success');
          this.isSaving.set(false);
        },
        error: (err) => {
          console.error(err);
          this.showToast('Erreur lors de la mise à jour', 'danger');
          this.isSaving.set(false);
        }
      });
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
