import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonList, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipse } from 'ionicons/icons';
import { Notification } from 'src/app/features/notification/model/notification.model';

@Component({
  selector: 'app-notification-popover',
  templateUrl: './notification-popover.component.html',
  styleUrls: ['./notification-popover.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonList, IonIcon]
})
export class NotificationPopoverComponent {
  readonly data = input<Notification[]>([]);
  readonly notificationClicked = output<Notification>();

  constructor() {
    addIcons({ ellipse });
  }

  onItemClick(n: Notification) {
    this.notificationClicked.emit(n);
  }
}
