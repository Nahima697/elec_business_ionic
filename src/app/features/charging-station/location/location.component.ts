import { Component, effect, inject, OnInit } from '@angular/core';
import { ChargingLocation } from 'src/app/features/charging-station/models/chargingLocation.model';
import { ChargingStation } from 'src/app/features/charging-station/models/chargingStation.model';
import { ChargingLocationService } from 'src/app/features/charging-station/services/charging-location.service';
import { ChargingStationService } from 'src/app/features/charging-station/services/charging-station.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle,
  IonCardContent, IonCardTitle, IonList, IonItem, IonLabel,IonThumbnail, IonButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { RouterLink } from '@angular/router';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from 'src/app/sharedComponent/form-field/form-field.component';
import { ControlType } from 'src/app/sharedComponent/form-field/form-field.enum.';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  imports: [IonButton,  IonLabel,
     IonItem, IonList,
     IonCardTitle,
     IonCardContent,
     IonCardSubtitle,
     IonCardHeader,
     IonCard,
     IonContent,
     IonHeader,
     IonTitle,
     IonToolbar,
     IonThumbnail,
     RouterLink,FormFieldComponent,ReactiveFormsModule]
})
export class LocationComponent implements OnInit {

  private chargingLocationService = inject(ChargingLocationService);
  private chargingStationService = inject(ChargingStationService);
  private authService = inject(AuthService);

  ControlType: typeof ControlType = ControlType;
  isLoading = false;
  locations: ChargingLocation[] = [];
  stationsByLocation: Record<string, ChargingStation[] | undefined> = {};

  user = this.authService.user;
  locationForm!:FormGroup;


  constructor() {
    effect(() => {
  this.user = this.authService.user;

        console.log('User signal:', this.user);

      if (this.user !== null) {
        this.loadLocations();
      } else {
        console.warn('User not available, skipping location load');
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.locationForm = new FormGroup({
    name:new FormControl('',{ validators: [Validators.required]}),
    addressLine:new FormControl('',{ validators: [Validators.required]}),
    postalCode:new FormControl(null,{ validators: [Validators.required]}),
    city:new FormControl('',{ validators: [Validators.required]}),
    country:new FormControl('',{ validators: [Validators.required]})
    })

  }

  loadLocations(): void {
    this.isLoading = true;

    this.chargingLocationService.getLocationByUser().subscribe({
      next: (locations: ChargingLocation[]) => {
        this.locations = locations;

        locations.forEach((location: ChargingLocation) => {
          if (location.id) {
            this.chargingStationService.getStationsByLocationId(location.id).subscribe((stations: ChargingStation[]) => {
              this.stationsByLocation[location.id] = stations;
            });
          }
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading locations:', err);
        this.isLoading = false;
      }
    });
  }
  get name():FormControl {
     return this.locationForm.get('name') as FormControl;
  }

  get addressLine():FormControl{
    return this.locationForm.get('addressLine') as FormControl;
  }

  get postalCode():FormControl {
    return this.locationForm.get('postalCode') as FormControl;
  }

  get city():FormControl {
    return this.locationForm.get('city') as FormControl;
  }

  get country() :FormControl {
    return this.locationForm.get('country') as FormControl;
  }


  onSubmit() {
    if(this.locationForm.valid && this.user !== null) {
      const nameValue = this.name?.value ?? '';
      const addressLineValue = this.addressLine?.value ?? '';
      const cityValue = this.city?.value ?? '';
      const countryValue = this.country?.value ?? '';
      const postalCodeValue = this.postalCode?.value ?? '';

      const locationData = {
        name: nameValue,
        addressLine: addressLineValue,
        postalCode : postalCodeValue,
        city:cityValue,
        country:countryValue,
        userId: this.user()!.id
      }

      this.chargingLocationService.createLocation(locationData)
      .subscribe({
         next: (response) =>  {
        console.log("location crée" ,response);

      },
      error :(error) => {
        console.error('Erreur',error)

       }
       });
    }
  }

}
