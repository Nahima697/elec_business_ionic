import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import {
  IonContent, IonButton, IonIcon, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline, mapOutline, listOutline,
  timeOutline, statsChartOutline, storefrontOutline,
  arrowBackOutline, flashOutline, cashOutline, calendarOutline,
  locationOutline, createOutline, trashOutline,batteryChargingOutline } from 'ionicons/icons';

// Components
import { LocationFormComponent } from 'src/app/features/charging-station/component/location-form/location-form.component';
import { StationFormComponent } from 'src/app/features/charging-station/component/station-form/station-form.component';
import { AvailabilityRulesComponent } from 'src/app/features/charging-station/component/availability-rules/availability-rules.component';

// Services
import { AppNavigationService } from 'src/app/core/services/app-navigation.service';
import { ChargingStationService } from 'src/app/features/charging-station/services/charging-station.service';
import { BookingService } from 'src/app/features/booking/service/booking.service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss']
})
export class OwnerDashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  public navService = inject(AppNavigationService);
  private stationService = inject(ChargingStationService);
  private bookingService = inject(BookingService);
  myStationsResource = this.stationService.getMyStations();

  myStations = computed(() => this.myStationsResource.value() ?? []);
  myStationsCount = computed(() => this.myStations()?.length ?? 0);
  pendingBookingsCount = signal(0);

  constructor() {
    addIcons({arrowBackOutline,addCircleOutline,cashOutline,calendarOutline,mapOutline,locationOutline,timeOutline,listOutline,createOutline,trashOutline,statsChartOutline,storefrontOutline,flashOutline,batteryChargingOutline});
  }

  ngOnInit() {
    if (!this.auth.hasRole('ROLE_OWNER')) {
      this.navService.go(['dashboard']);
    }

    this.loadPendingBookings();
  }

 loadPendingBookings() {
    this.bookingService.getMyBookingsOwner().subscribe({
      next: (bookings) => {
        const count = bookings.filter(b => b.statusLabel === 'PENDING').length;
        this.pendingBookingsCount.set(count);
      },
      error: () => this.pendingBookingsCount.set(0)
    });
  }

  goBack() {
    this.navService.go(['dashboard']);
  }

  goToMyLocations() {
    this.navService.go(['user', 'owner', 'locations']);
  }

  goToMyBookings() {
    this.navService.go(['user', 'owner', 'bookings']);
  }

  goToMyStations() {
     this.navService.go(['user', 'owner', 'stations']);
  }

  goToEditStation(stationId: string) {
    this.navService.go(['user', 'owner', 'stations', stationId, 'edit']);
  }

  async openAddLocationModal() {
    const modal = await this.modalCtrl.create({ component: LocationFormComponent });
    await modal.present();
  }

  async openAddStationModal() {
    const modal = await this.modalCtrl.create({ component: StationFormComponent });
    await modal.present();

    modal.onDidDismiss().then(() => {
       this.myStationsResource.reload();
    });
  }

  async openAvailabilityModal() {
    const modal = await this.modalCtrl.create({ component: AvailabilityRulesComponent });
    await modal.present();
  }

  async confirmDeleteStation(stationId: string, event: Event) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Supprimer la borne ?',
      message: 'Cette action est irréversible. Les réservations passées seront conservées, mais les futures seront annulées.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.deleteStation(stationId);
          }
        }
      ]
    });

    await alert.present();
  }

  private deleteStation(id: string) {
    this.stationService.deleteChargingStation(id).subscribe({
      next: () => {
        this.myStationsResource.reload();
        this.showToast('Borne supprimée avec succès', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showToast('Impossible de supprimer la borne (peut-être a-t-elle des réservations en cours ?)', 'danger');
      }
    });
  }

  private async showToast(msg: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}

