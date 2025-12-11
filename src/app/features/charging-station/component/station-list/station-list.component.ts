import { Component, input } from '@angular/core';
import { StationCardComponent } from '../station-card/station-card.component';
import { ChargingStationResponseDTO } from '../../models/charging-station.model';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-station-list',
  standalone: true,
  imports: [ StationCardComponent, IonIcon],
  templateUrl: './station-list.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class StationListComponent {
  readonly stations = input.required<ChargingStationResponseDTO[]>();
  readonly isLoading = input<boolean>(false);

  constructor() {
    addIcons({ sadOutline });
  }
}
