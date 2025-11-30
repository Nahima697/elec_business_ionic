import { Component} from '@angular/core';
import { IonTabs, IonTabBar, IonRouterOutlet, IonTabButton, IonIcon, IonLabel} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { searchOutline,chatboxEllipsesOutline,calendarOutline,personOutline} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [ IonRouterOutlet, IonTabBar, IonTabs, IonTabButton, IonIcon, IonLabel, RouterLink],
})
export class TabsPage  {

  constructor() {
    addIcons({searchOutline,
      chatboxEllipsesOutline,
      calendarOutline,
      personOutline
  });
}

}
