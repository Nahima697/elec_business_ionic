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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  private userProfileService = inject(UserProfileService);

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
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
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

  async changeProfilePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (image.base64String) {
        // 1. Conversion Base64 -> Blob -> File
        const blob = this.base64ToBlob(image.base64String, `image/${image.format}`);
        const file = new File([blob], "avatar.jpg", { type: `image/${image.format}` });

        // 2. Envoi au service qui attend un File
        this.userProfileService.uploadAvatar(file).subscribe({
          next: (updatedProfile) => {
            this.user.set(updatedProfile);
            this.showToast('Photo de profil mise à jour', 'success');},
          error: (err) => console.error("Erreur upload", err)
        });
      }
    } catch (e) {
      console.log('User cancelled photo', e);
    }
  }

  private base64ToBlob(base64: string, contentType: string = '', sliceSize: number = 512): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
