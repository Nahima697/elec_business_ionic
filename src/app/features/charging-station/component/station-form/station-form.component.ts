import {
  Component,
  inject,
  OnInit,
  output,
  signal,
  Input,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ChargingStationService } from '../../services/charging-station.service';
import { ChargingLocationService } from '../../services/charging-location.service';
import { ChargingLocation } from '../../models/charging-location.model';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import {
  IonList,
  IonItem,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonText,
  IonContent,
  ToastController,
  ModalController,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  closeOutline,
  imageOutline,
  trashOutline,
  saveOutline,
} from 'ionicons/icons';
import { GeolocalisationService } from 'src/app/features/display-map/service/geolocalisation.service';
import { ChargingStationRequestDTO } from '../../models/charging-station.model';

@Component({
  selector: 'app-station-form',
  standalone: true,
  imports: [
    IonSpinner,
    IonButtons,
    IonHeader,
    ReactiveFormsModule,
    FormFieldComponent,
    IonItem,
    IonContent,
    IonButton,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonText,
    IonList,
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
  private router = inject(Router);
  private navCtrl = inject(NavController);

  @Input() set id(value: string) {
    this.idSignal.set(value);
  }

  @Input() set locationId(value: string) {
    this.locIdSignal.set(value);
  }

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
    addIcons({
      cameraOutline,
      imageOutline,
      trashOutline,
      closeOutline,
      saveOutline,
    });
  }
  compareById = (o1: any, o2: any) => {
    return String(o1) === String(o2);
  };

  ngOnInit(): void {
    this.stationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      powerKw: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      locationId: new FormControl('', [Validators.required]),
      lat: new FormControl(null, [Validators.required]),
      lng: new FormControl(null, [Validators.required]),
    });

    const currentLocId = this.locIdSignal();
    const currentId = this.idSignal();

    this.locationService.getLocationByUser().subscribe({
      next: (locs) => {
        this.myLocations.set(locs);

        if (currentId) {
          this.isEditMode.set(true);
          this.loadStationData(currentId);
        }
      },
    });
  }

  loadStationData(id: string) {
    this.isLoading.set(true);

    this.stationService.getChargingStationDetail(id).subscribe({
      next: (station) => {
        const locationId = String(station.locationDTO?.id);

        this.stationForm.patchValue({
          name: station.name,
          description: station.description,
          powerKw: station.powerKw,
          price: station.price,
          lat: station.lat,
          lng: station.lng,
          locationId: locationId,
        });

        setTimeout(() => {
          this.stationForm.get('locationId')?.setValue(locationId);
        });

        if (station.imageUrl) {
          this.imagePreview = station.imageUrl;
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.presentToast('Impossible de charger la borne', 'danger');
        this.cancel();
      },
    });
  }

  loadLocations() {
    this.locationService.getLocationByUser().subscribe({
      next: (locs) => this.myLocations.set(locs),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  onSubmit() {
    if (this.stationForm.invalid) {
      this.stationForm.markAllAsTouched();
      this.presentToast(
        'Veuillez remplir tous les champs obligatoires',
        'danger'
      );
      return;
    }

    this.isLoading.set(true);

    const formValues = this.stationForm.getRawValue();
    const fileToUpload = this.selectedFile || undefined;

    if (this.isEditMode()) {
      const updateDto: ChargingStationRequestDTO = {
        ...formValues,
        id: this.idSignal(),
      };

      this.stationService
        .updateChargingStation(updateDto, fileToUpload)
        .subscribe({
          next: () => this.handleSuccess('Borne modifiée avec succès !'),
          error: () => this.handleError(),
        });
    } else {
      this.stationService.createStation(formValues, fileToUpload).subscribe({
        next: () => this.handleSuccess('Borne créée avec succès !'),
        error: () => this.handleError(),
      });
    }
  }

  async handleSuccess(msg: string) {
    this.isLoading.set(false);
    await this.presentToast(msg, 'success');
    this.stationForm.reset();
    this.stationCreated.emit();

    const top = await this.modalCtrl.getTop();

    if (top) {
      this.modalCtrl.dismiss(true, 'confirm');
    } else {
      this.navCtrl.back();
    }
  }

  handleError() {
    this.isLoading.set(false);
    this.presentToast('Une erreur est survenue.', 'danger');
  }

  async cancel() {
    const top = await this.modalCtrl.getTop();

    if (top) {
      this.modalCtrl.dismiss(null, 'cancel');
    } else {
      this.navCtrl.back();
    }
  }
}
