import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChargingStation } from 'src/app/sharedComponent/models/chargingStation.model';
import { ChargingStationService } from 'src/app/sharedComponent/services/charging-station.service';
import { IonCard, IonButton, IonTitle, IonHeader, IonContent,IonCardContent,IonCardHeader,IonCardSubtitle,IonCardTitle,IonToolbar, IonSpinner } from "@ionic/angular/standalone";
import { CurrencyPipe, DatePipe } from '@angular/common';

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
export class StationDetailComponent  implements OnInit {
private activatedRoute = inject(ActivatedRoute);
  private chargingStationService = inject(ChargingStationService);
 station?:ChargingStation;

    ngOnInit() {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        if(id !== null) {
          this.chargingStationService.getChargingStationDetail(id).subscribe((station:ChargingStation) =>
          {
            this.station = station;

          })
        }
      }
}
