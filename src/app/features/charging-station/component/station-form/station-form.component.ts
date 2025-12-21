import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargingStationService } from '../../services/charging-station.service';
import { ChargingLocationService } from '../../services/charging-location.service';
import { ChargingLocation } from '../../models/charging-location.model';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import {
  IonList, IonItem, IonButton,
   IonSelect, IonSelectOption, IonIcon, IonText,IonContent,
  ToastController, ModalController, IonHeader, IonButtons,IonToolbar,IonTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, closeOutline, imageOutline, trashOutline } from 'ionicons/icons';
import { GeolocalisationService } from 'src/app/shared-component/services/geolocalisation.service';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [IonButtons, IonHeader,
    ReactiveFormsModule,
    FormFieldComponent,
    IonList, IonItem, IonContent,IonButton,IonTitle,
IonToolbar,IonSelect, IonSelectOption, IonIcon, IonText
  ],
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss'],
})
export class StationFormComponent implements OnInit {
  private stationService = inject(ChargingStationService);
  private locationService = inject(ChargingLocationService);
  private geoService = inject(GeolocalisationService);
  private toastCtrl = inject(ToastController); // <--- Injection correcte
  private modalCtrl = inject(ModalController); // <--- Injection Modal

  stationCreated = output<void>();
  stationForm!: FormGroup;
  ControlType = ControlType;

  myLocations = signal<ChargingLocation[]>([]);
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor() {
    addIcons({ cameraOutline, imageOutline, trashOutline,closeOutline});
  }

  ngOnInit(): void {
    // 1. Initialisation
    this.stationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      powerKw: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      locationId: new FormControl('', [Validators.required]),
      lat: new FormControl(null, [Validators.required]),
      lng: new FormControl(null, [Validators.required]),
    });

    // 2. Chargement des lieux (API)
    this.loadLocations();

    // 3. Autocomplétion Lat/Lng via Adresse
    this.stationForm.get('locationId')?.valueChanges.subscribe(async (locationId) => {
      const selectedLocation = this.myLocations().find(l => l.id === locationId);

      if (selectedLocation) {
        // On sécurise la construction de l'adresse
        const parts = [selectedLocation.addressLine, selectedLocation.postalCode, selectedLocation.city].filter(Boolean);
        const fullAddress = parts.join(', ');

        console.log('📍 Recherche coordonnées pour :', fullAddress);

        this.geoService.geocodeAddress(fullAddress).subscribe({
          next: (coords) => {
            if (coords) {
              console.log('✅ Coordonnées :', coords);
              this.stationForm.patchValue({ lat: coords.lat, lng: coords.lng });
              this.presentToast('Lieu localisé avec succès', 'success');
            } else {
              this.presentToast('Impossible de localiser ce lieu', 'danger');
            }
          },
          error: () => this.presentToast('Erreur de géolocalisation', 'danger')
        });
      }
    });
  }

 loadLocations() {
    console.log("🔄 Tentative de chargement des lieux...");
    this.locationService.getLocationByUser().subscribe({
      next: (locs) => {
        console.log("Lieux chargés :", locs);
        this.myLocations.set(locs);
      },
      error: (err) => console.error(" Erreur API :", err)
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

  // Fonction Toast corrigée
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  onSubmit() {
    if (this.stationForm.valid) {
      this.stationService.createStation(this.stationForm.value, this.selectedFile || undefined)
        .subscribe({
          next: () => {
            // 1. Toast Succès
            this.presentToast('Borne créée avec succès !', 'success');

            // 2. Reset
            this.stationForm.reset();
            this.selectedFile = null;
            this.imagePreview = null;
            this.stationCreated.emit();

            // 3. FERMETURE DE LA MODALE
            this.modalCtrl.dismiss(true, 'confirm');
          },
          error: (err) => {
            console.error(err);
            this.presentToast('Erreur lors de la création.', 'danger');
          }
        });
    } else {
      this.stationForm.markAllAsTouched();
      this.presentToast('Veuillez remplir tous les champs obligatoires', 'danger');
    }
  }
  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
