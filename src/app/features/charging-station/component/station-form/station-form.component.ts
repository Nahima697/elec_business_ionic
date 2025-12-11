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
import { addIcons } from 'ionicons';
import { cameraOutline, imageOutline } from 'ionicons/icons';

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

  stationCreated = output<void>();
  stationForm!: FormGroup;
  ControlType = ControlType;

  myLocations = signal<ChargingLocation[]>([]);
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor() {
    addIcons({ cameraOutline, imageOutline });
  }

  ngOnInit(): void {
    this.stationForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      powerKw: new FormControl(null, [Validators.required, Validators.min(0)]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      locationId: new FormControl('', [Validators.required]),
      lat: new FormControl(0, [Validators.required]),
      lng: new FormControl(0, [Validators.required]),
    });

    this.loadLocations();
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
      // Pour createStation, le backend attend un FormData (géré par le service)
      this.stationService.createStation(this.stationForm.value, this.selectedFile || undefined)
        .subscribe({
          next: () => {
            this.stationForm.reset();
            this.selectedFile = null;
            this.imagePreview = null;
            this.stationCreated.emit();
          },
          error: (err) => console.error('Erreur création station', err)
        });
    } else {
      this.stationForm.markAllAsTouched();
    }
  }
}
