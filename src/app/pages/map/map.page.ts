import { Component, OnInit } from '@angular/core';
import { IonContent} from '@ionic/angular/standalone';
import { DisplayMapComponent } from 'src/app/sharedComponent/display-map/display-map.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [ DisplayMapComponent,IonContent]
})
export class MapPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
