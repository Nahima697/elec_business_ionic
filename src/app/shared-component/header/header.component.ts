import { Component, inject, signal, computed, input, model, OnInit } from '@angular/core';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';
import { PlatformService } from 'src/app/core/auth/services/platform.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'src/app/features/notification/service/notification.service';
import { Notification } from 'src/app/features/notification/model/notification.model';
import { PopoverController, IonPopover} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipse } from 'ionicons/icons';
import { NotificationPopoverComponent } from 'src/app/features/notification/component/notification-popover/notification-popover.component';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, IonPopover, NotificationPopoverComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private platformService = inject(PlatformService);
  private notifService = inject(NotificationService);
  private authService = inject(AuthService);
  readonly stations = input<any>();
  ControlType = ControlType;
  open = model.required<boolean>();

  protected readonly searchFilter = signal('');
  protected unreadCount = this.notifService.unreadCount;
  protected notifications: Notification[] = [];

  constructor() {
    addIcons({ ellipse });
  }

  ngOnInit() {
    this.refreshNotifications();
    if (this.platformService.isBrowser()) {
      setInterval(() => this.refreshNotifications(), 30000);
    }
  }

  refreshNotifications() {
    this.notifService.getMyNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  onNotifClick(n: Notification) {
    if (!n.isRead) {
      this.notifService.markAsRead(n.id).subscribe();
      n.isRead = true;
    }
  }

  protected readonly filteredStations = computed(() => {
    const rawData = this.stations();
    let list: ChargingStationResponseDTO[] = [];

    if (rawData?.content && Array.isArray(rawData.content)) {
      list = rawData.content;
    } else if (Array.isArray(rawData)) {
      list = rawData;
    }

    const filter = this.searchFilter()?.toLowerCase() ?? '';
    if (!filter) return list;

    return list.filter(station =>
      station.name?.toLowerCase().includes(filter) ||
      station.locationDTO?.addressLine?.toLowerCase().includes(filter)
    );
  });

  close() {
    this.open.set(false);
  }

  toggleMenu() {
    this.open.update(value => !value);
  }

  protected readonly links = computed(() => [
    { path: '/', name: 'Accueil' },
    { path: '/map', name: 'Carte' },
    { path: '/login', name: 'Se connecter' },
    { path: '/profile', name: 'Mon Compte' }
  ]);

  onProfileClick() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  onLocalSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const inputValue = (event as CustomEvent).detail?.value || target.value || '';

    this.searchFilter.set(inputValue);

    if (!this.platformService.isBrowser()) return;

    if (inputValue.length > 2) {
       this.router.navigate(['/map'], {
         state: { searchTerm: inputValue }
       });
    }
  }
}


