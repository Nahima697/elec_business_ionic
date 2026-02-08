import { Component, inject, OnInit, output, signal, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargingStationService } from '../../services/charging-station.service';
import { ChargingLocationService } from '../../services/charging-location.service';
import { ChargingLocation } from '../../models/charging-location.model';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import {
  IonList, IonItem, IonButton,
  IonSelect, IonSelectOption, IonIcon, IonText, IonContent,
  ToastController, ModalController, IonHeader, IonButtons, IonToolbar, IonTitle, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cameraOutline, closeOutline, imageOutline, trashOutline, saveOutline } from 'ionicons/icons';
import { GeolocalisationService } from 'src/app/features/display-map/service/geolocalisation.service';
import { ChargingStationRequestDTO } from '../../models/charging-station.model';

@Component({
  selector: 'app-station-form',
  standalone: true,
  // ⚠️ IMPORTANT : Pas de ModalController ni ToastController ici !
  imports: [
    IonSpinner, IonButtons, IonHeader,
    ReactiveFormsModule,
    FormFieldComponent,
    IonItem, IonContent, IonButton, IonTitle,
    IonToolbar, IonSelect, IonSelectOption, IonIcon, IonText, IonList
  ],
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss'],
})
export class StationFormComponent implements OnInit {
  private stationService = inject(ChargingStationService);
  private locationService = inject(ChargingLocationService);
  private geoService = inject(GeolocalisationService);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);

  // 1. INPUTS : Ionic injecte les valeurs ici
  @Input() set id(value: string) {
    this.idSignal.set(value);
  }
  @Input() set locationId(value: string) {
    this.locIdSignal.set(value);
  }

  // 2. SIGNAUX INTERNES : Pour la logique métier
  private readonly idSignal = signal('');
  private readonly locIdSignal = signal('');

  stationCreated = output<void>();
  stationForm!: FormGroup;
  ControlType = ControlType;

  myLocations = signal<ChargingLocation[]>([]);
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isEditMode = signal(false);
  isLoading = signal(false);

  constructor() {
    addIcons({ cameraOutline, imageOutline, trashOutline, closeOutline, saveOutline });
  }

  ngOnInit(): void {
    // 1. Initialisation du formulaire
    this.stationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      powerKw: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      locationId: new FormControl('', [Validators.required]),
      lat: new FormControl(null, [Validators.required]),
      lng: new FormControl(null, [Validators.required]),
    });

    // 2. Chargement des lieux disponibles
    this.loadLocations();

    // 3. Récupération des valeurs depuis les signaux
    const currentLocId = this.locIdSignal();
    const currentId = this.idSignal();

    if (currentLocId) {
      this.stationForm.patchValue({
        locationId: currentLocId
      });
      this.stationForm.get('locationId')?.disable();
    }

    if (currentId) {
      this.isEditMode.set(true);
      this.loadStationData(currentId);
    }

    // 4. Autocomplétion Lat/Lng quand on change de lieu
    this.stationForm.get('locationId')?.valueChanges.subscribe(async (locId) => {
      if (this.isLoading()) return;

      const selectedLocation = this.myLocations().find(l => l.id === locId);
      if (selectedLocation) {
        const parts = [selectedLocation.addressLine, selectedLocation.postalCode, selectedLocation.city].filter(Boolean);
        const fullAddress = parts.join(', ');

        this.geoService.geocodeAddress(fullAddress).subscribe({
          next: (coords) => {
            if (coords) {
              this.stationForm.patchValue({ lat: coords.lat, lng: coords.lng });
            }
          }
        });
      }
    });
  }

  loadStationData(id: string) {
    this.isLoading.set(true);
    this.stationService.getChargingStationDetail(id).subscribe({
      next: (station) => {
        this.stationForm.patchValue({
          name: station.name,
          description: station.description,
          powerKw: station.powerKw,
          price: station.price,
          locationId: station.locationDTO?.id,
          lat: station.lat,
          lng: station.lng
        });

        if (station.imageUrl) {
          this.imagePreview = station.imageUrl;
        }

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.presentToast('Impossible de charger la borne', 'danger');
        this.cancel();
      }
    });
  }

  loadLocations() {
    this.locationService.getLocationByUser().subscribe({
      next: (locs) => this.myLocations.set(locs),
      error: (err) => console.error("Erreur API :", err)
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
    if (this.stationForm.invalid) {
      this.stationForm.markAllAsTouched();
      this.presentToast('Veuillez remplir tous les champs obligatoires', 'danger');
      return;
    }

    this.isLoading.set(true);
    const formValues = this.stationForm.getRawValue();
    const fileToUpload = this.selectedFile || undefined;

    if (this.isEditMode()) {
      const updateDto: ChargingStationRequestDTO = {
        ...formValues,
        id: this.idSignal() // Utilisation du signal interne
      };

      this.stationService.updateChargingStation(updateDto, fileToUpload).subscribe({
        next: () => this.handleSuccess('Borne modifiée avec succès !'),
        error: (err) => this.handleError(err)
      });

    } else {
      this.stationService.createStation(formValues, fileToUpload)
        .subscribe({
          next: () => this.handleSuccess('Borne créée avec succès !'),
          error: (err) => this.handleError(err)
        });
    }
  }

  handleSuccess(msg: string) {
    this.isLoading.set(false);
    this.presentToast(msg, 'success');
    this.stationForm.reset();
    this.stationCreated.emit();
    this.modalCtrl.dismiss(true, 'confirm');
  }

  handleError(err: any) {
    console.error(err);
    this.isLoading.set(false);
    this.presentToast('Une erreur est survenue.', 'danger');
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
