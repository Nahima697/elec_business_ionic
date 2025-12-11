import { Component, inject, output, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargingLocationService } from 'src/app/features/charging-station/services/charging-location.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { IonList, IonItem, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    IonList, IonItem, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle
  ],
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
})
export class LocationFormComponent implements OnInit {
  private chargingLocationService = inject(ChargingLocationService);
  private authService = inject(AuthService);

  // Output pour prévenir le parent qu'une location a été créée
  locationCreated = output<void>();

  locationForm!: FormGroup;
  ControlType = ControlType;
  user = this.authService.user;

  ngOnInit(): void {
    this.locationForm = new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      addressLine: new FormControl('', { validators: [Validators.required] }),
      postalCode: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl('', { validators: [Validators.required] }),
      country: new FormControl('', { validators: [Validators.required] })
    });
  }

  // Getters pour le template
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
          console.log("Location créée", response);
          this.locationForm.reset();
          this.locationCreated.emit(); 
        },
        error: (error) => console.error('Erreur création location', error)
      });
    }
  }
}
