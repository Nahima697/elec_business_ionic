
import { Component} from '@angular/core';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import { Map } from 'maplibre-gl';
@Component({
  selector: 'app-map',
  standalone: true,
  imports:[MapComponent],
  template: `
  <mgl-map
    [style]="'https://demotiles.maplibre.org/style.json'"
    [zoom]="[9]"
    [center]="[-74.50, 40]"
    (mapLoad)="map = $event"
  ></mgl-map>
  `,
})

export class DisplayMapComponent {
  map!: Map;

}
