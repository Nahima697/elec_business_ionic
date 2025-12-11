import { Component, input} from '@angular/core';
import { ChargingStation } from '../../models/charging-station.model';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,CurrencyPipe],
})
export class StationCardComponent   {
readonly station = input.required<ChargingStation>();

}
