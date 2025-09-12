import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PlatformService } from 'src/app/sharedComponent/services/platform.service';

@Component({
  selector: 'app-verif-method',
  templateUrl: './verif-method.page.html',
  styleUrls: ['./verif-method.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class VerifMethodPage implements OnInit {

  constructor() { }
  platform = inject(PlatformService);

  ngOnInit() {
    if(this.platform.isMobile()) {

    }
  }

}
