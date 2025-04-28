import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonButton,IonContent,IonTitle, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OnboardingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

}
