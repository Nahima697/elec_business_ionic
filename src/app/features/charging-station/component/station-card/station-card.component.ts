import { Component, input} from '@angular/core';
import { ChargingStationResponseDTO } from '../../models/charging-station.model';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,IonIcon} from '@ionic/angular/standalone';
import { CurrencyPipe, DecimalPipe, NumberSymbol } from '@angular/common';
@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,CurrencyPipe,IonIcon,DecimalPipe],
})
export class StationCardComponent   {
readonly station = input.required<ChargingStationResponseDTO>();

}
