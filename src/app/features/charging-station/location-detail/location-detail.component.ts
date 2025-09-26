import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChargingLocation } from 'src/app/sharedComponent/models/chargingLocation.model';
import { ChargingLocationService } from 'src/app/sharedComponent/services/charging-location.service';
import { IonCard, IonButton, IonTitle, IonHeader, IonContent,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss'],
    imports: [
     IonCardTitle,
     IonCardContent,
     IonCardSubtitle,
     IonCardHeader,
     IonCard,
     IonContent,
     IonHeader,
     IonTitle,
     IonButton,
     IonToolbar]
})
export class LocationDetailComponent  implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private chargingLocationService = inject(ChargingLocationService);
  private location?:ChargingLocation;


  constructor() { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id !== null) {
      this.chargingLocationService.getChargingLocationDetail(id).subscribe((location:ChargingLocation) =>
      {
        this.location = location;

      })
    }


  }

}
