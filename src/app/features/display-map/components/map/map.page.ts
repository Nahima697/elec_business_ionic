import { Component, inject } from '@angular/core';
import { IonContent} from '@ionic/angular/standalone';
import { DisplayMapComponent } from 'src/app/features/display-map/pages/display-map.component';
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [ DisplayMapComponent,IonContent]
})
export class MapPage  {
  private stationService =inject(StationApiService)
  readonly stations = this.stationService.getAll();

}
