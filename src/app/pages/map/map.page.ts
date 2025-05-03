import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DisplayMapComponent } from 'src/app/sharedComponent/display-map/display-map.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,DisplayMapComponent,FormsModule]
})
export class MapPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
