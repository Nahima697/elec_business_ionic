import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChargingStation } from 'src/app/sharedComponent/models/chargingStation.model';
import { ChargingStationService } from 'src/app/sharedComponent/services/charging-station.service';
import { IonCard, IonButton, IonTitle, IonHeader, IonContent,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,IonToolbar, IonSpinner } from "@ionic/angular/standalone";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { StationApiService } from 'src/app/sharedComponent/services/station-api.service';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
    imports: [CurrencyPipe,DatePipe,
      IonSpinner,
     IonCardTitle,
     IonCardContent,
     IonCardSubtitle,
     IonCardHeader,
     IonCard,
     IonContent,
     IonHeader,
     IonTitle,
     IonButton,
     IonToolbar,
    IonSpinner]
})
export class StationDetailComponent  {
private activatedRoute = inject(ActivatedRoute);
private chargingStationService = inject(ChargingStationService);
//  station?:ChargingStation;

 readonly id = input.required<string>();
 private readonly stationApi = inject(StationApiService);

    // ngOnInit() {
    //     let id = this.activatedRoute.snapshot.paramMap.get('id');
    //     if(id !== null) {
    //       this.chargingStationService.getChargingStationDetail(id).subscribe((station:ChargingStation) =>
    //       {
    //         this.station = station;

    //       })
    //     }
    //   }

    protected readonly station= this.stationApi.getOne(this.id);
}
