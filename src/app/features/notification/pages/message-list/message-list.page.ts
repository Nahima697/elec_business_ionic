import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
  IonLabel, IonNote, IonIcon, IonRefresher, IonRefresherContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailOpenOutline, notificationsOffOutline } from 'ionicons/icons';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../model/notification.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.page.html',
  standalone: true,
  imports: [
    CommonModule, DatePipe,
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel,  IonIcon, IonRefresher, IonRefresherContent
  ]
})
export class MessageListPage implements OnInit {
  private notifService = inject(NotificationService);

  notifications = signal<Notification[]>([]);

  constructor() {
    addIcons({ mailOutline, mailOpenOutline, notificationsOffOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(event?: any) {
    this.notifService.getMyNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        event?.target.complete();
      },
      error: () => event?.target.complete()
    });
  }

  markAsRead(n: Notification) {
    if (n.isRead) return;
    // Appel optimiste (mise à jour visuelle immédiate)
    this.notifications.update(list => list.map(item => item.id === n.id ? {...item, isRead: true} : item));
    // Appel backend
    this.notifService.markAsRead(n.id).subscribe();
  }
}
