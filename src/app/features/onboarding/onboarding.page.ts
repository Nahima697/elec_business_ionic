import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class OnboardingPage {

  activeIndex = 0;

  constructor() { }

  /**
   * Détecte le défilement pour mettre à jour les points indicateurs
   */
  onScroll(event: any) {
    const scrollElement = event.target;
    const scrollLeft = scrollElement.scrollLeft;
    const width = scrollElement.offsetWidth;

    const index = Math.round(scrollLeft / width);

    if (index !== this.activeIndex) {
      this.activeIndex = index;
    }
  }
}
