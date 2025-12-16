import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargingStationService } from '../../services/charging-station.service';
import { ChargingLocationService } from '../../services/charging-location.service';
import { ChargingLocation } from '../../models/charging-location.model';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import {
  IonList, IonItem, IonButton, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonSelect, IonSelectOption, IonIcon, IonText
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cameraOutline, imageOutline, trashOutline } from 'ionicons/icons'; // Ajout trashOutline
import { GeolocalisationService } from 'src/app/shared-component/services/geolocalisation.service';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    IonList, IonItem, IonButton, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonSelect, IonSelectOption, IonIcon, IonText
  ],
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss'],
})
export class StationFormComponent implements OnInit {
  private stationService = inject(ChargingStationService);
  private locationService = inject(ChargingLocationService);
  private geoService = inject(GeolocalisationService);
  private toastController = inject(ToastController);

  stationCreated = output<void>();
  stationForm!: FormGroup;
  ControlType = ControlType;

  myLocations = signal<ChargingLocation[]>([]);
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor() {
    // On ajoute toutes les icônes nécessaires
    addIcons({ cameraOutline, imageOutline, trashOutline });
  }

  ngOnInit(): void {
    // 1. Initialisation du Formulaire
    this.stationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      powerKw: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      locationId: new FormControl('', [Validators.required]),
      // Champs cachés pour la géolocalisation
      lat: new FormControl(null, [Validators.required]),
      lng: new FormControl(null, [Validators.required]),
    });

    // 2. Chargement des lieux
    this.loadLocations();

    // 3. Écouteur sur le changement de lieu pour calculer lat/lng
    this.stationForm.get('locationId')?.valueChanges.subscribe(async (locationId) => {
      const selectedLocation = this.myLocations().find(l => l.id === locationId);

      if (selectedLocation) {
        const fullAddress = `${selectedLocation.addressLine}, ${selectedLocation.postalCode} ${selectedLocation.city}`;

        console.log('📍 Recherche coordonnées pour :', fullAddress);

        this.geoService.geocodeAddress(fullAddress).subscribe({
          next: (coords) => {
            if (coords) {
              console.log('✅ Coordonnées trouvées :', coords);
              // Mise à jour des champs cachés
              this.stationForm.patchValue({
                lat: coords.lat,
                lng: coords.lng
              });
              this.presentToast('Adresse localisée avec succès', 'success');
            } else {
              console.warn('⚠️ Adresse introuvable');
              this.presentToast('Impossible de localiser cette adresse automatiquement', 'danger');
            }
          },
          error: (err) => {
            console.error('Erreur géocodage', err);
            this.presentToast('Erreur technique lors de la localisation', 'danger');
          }
        });
      }
    });
  }

  // Helper pour récupérer un FormControl typé dans le HTML
  getControl(name: string): FormControl {
    return this.stationForm.get(name) as FormControl;
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  loadLocations() {
    this.locationService.getLocationByUser().subscribe({
      next: (locs) => this.myLocations.set(locs),
      error: (err) => console.error('Erreur chargement lieux', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  onSubmit() {
    if (this.stationForm.valid) {
      this.stationService.createStation(this.stationForm.value, this.selectedFile || undefined)
        .subscribe({
          next: () => {
            this.stationForm.reset();
            this.selectedFile = null;
            this.imagePreview = null;
            this.presentToast('Borne créée avec succès !', 'success');
            this.stationCreated.emit();
          },
          error: () =>
            this.presentToast('Erreur lors de la création.', 'danger')
        });
    } else {
      this.stationForm.markAllAsTouched();
    }
  }
}
