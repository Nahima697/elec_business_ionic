import { Component, inject, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonRouterOutlet, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular/standalone'; // + IonBadge
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { searchOutline, chatboxEllipsesOutline, calendarOutline, personOutline } from 'ionicons/icons';
import { NotificationService } from 'src/app/features/notification/service/notification.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, IonTabBar, IonTabs, IonTabButton, IonIcon, IonLabel, RouterLink, IonBadge], 
})
export class TabsPage implements OnInit {

  private notifService = inject(NotificationService);
  unreadCount = this.notifService.unreadCount;

  constructor() {
    addIcons({searchOutline,
      chatboxEllipsesOutline,
      calendarOutline,
      personOutline
    });
  }

  ngOnInit() {
    this.refresh();
    setInterval(() => this.refresh(), 30000);
  }

  refresh() {
    this.notifService.getMyNotifications().subscribe();
  }
}
