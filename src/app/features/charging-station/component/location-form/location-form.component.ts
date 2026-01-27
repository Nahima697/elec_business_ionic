import { Component, inject, output, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargingLocationService } from 'src/app/features/charging-station/services/charging-location.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import {
  IonList, IonIcon, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  ToastController, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    IonList, IonIcon, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle
  ],
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit {
  private chargingLocationService = inject(ChargingLocationService);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);

  locationCreated = output<void>();

  locationForm!: FormGroup;
  ControlType = ControlType;
  user = this.authService.user;
  constructor() {
  addIcons({ closeOutline });
}

  ngOnInit(): void {
    this.locationForm = new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      addressLine: new FormControl('', { validators: [Validators.required] }),
      postalCode: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl('', { validators: [Validators.required] }),
      country: new FormControl('', { validators: [Validators.required] })
    });
  }

  // Helper pour afficher le Toast
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  // Getters
  get name(): FormControl { return this.locationForm.get('name') as FormControl; }
  get addressLine(): FormControl { return this.locationForm.get('addressLine') as FormControl; }
  get postalCode(): FormControl { return this.locationForm.get('postalCode') as FormControl; }
  get city(): FormControl { return this.locationForm.get('city') as FormControl; }
  get country(): FormControl { return this.locationForm.get('country') as FormControl; }

  onSubmit() {
    if (this.locationForm.valid && this.user()) {
      const locationData = {
        ...this.locationForm.value,
        userId: this.user()!.id
      };

      this.chargingLocationService.createLocation(locationData).subscribe({
        next: (response) => {

          // 1. Reset du form
          this.locationForm.reset();

          // 2. Afficher le Toast
          this.presentToast('Lieu ajouté avec succès !', 'success');

          // 3. Emettre l'event (optionnel si on ferme la modale)
          this.locationCreated.emit();

          // 4. Fermer la modale (Retour au Dashboard)
          this.modalCtrl.dismiss(response, 'confirm');
        },
        error: (error) => {
          console.error('Erreur création location', error);
          this.presentToast('Erreur lors de la création du lieu', 'danger');
        }
      });
    } else {
      this.locationForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
