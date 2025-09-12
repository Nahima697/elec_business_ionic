import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ChargingStation } from 'src/app/sharedComponent/models/chargingStation.model';
import { ChargingStationService } from 'src/app/sharedComponent/services/charging-station.service';
import { IonHeader, IonCardSubtitle,IonTitle,IonToolbar,IonThumbnail,
   IonCardContent, IonList, IonItem, IonCardTitle,IonLabel,IonCard,IonCardHeader,IonContent } from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-charging-station',
  templateUrl: './charging-station.component.html',
   imports: [ CurrencyPipe,DatePipe,
     IonCardTitle,
     IonCardContent,
     IonCardSubtitle,
     IonCardHeader,
     IonCard,
     IonContent,
     IonHeader,
     IonTitle,
     IonToolbar,
     RouterLink]
,
  styleUrls: ['./charging-station.component.scss'],
})
export class ChargingStationComponent  implements OnInit {

  private authService = inject(AuthService);
  private chargingStationService = inject(ChargingStationService);
  isLoading = false;
  stations:ChargingStation[]=[];

  ngOnInit() {}

  loadStations ():void {
    this.chargingStationService.getChargingStations().subscribe({
       next:(stations: ChargingStation[]) => {
             this.stations = stations;
    }
  });

  }






}
