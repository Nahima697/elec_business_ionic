import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet,Platform } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';


register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  isMobile: boolean;
  constructor(private platform: Platform) {
    this.isMobile = this.platform.is('mobile');
  }
}
