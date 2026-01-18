import { Component, computed, inject, input, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonButton, IonTitle, IonHeader, IonContent, IonToolbar, IonModal, IonToast, IonSpinner, IonIcon } from "@ionic/angular/standalone";
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';
import { BookingFormComponent } from '../../../booking/component/booking-form/booking-form.component';
import { BookingService } from '../../../booking/service/booking.service';
import { BookingRequestDTO } from '../../../booking/models/booking';
import { StationCardComponent } from "../../component/station-card/station-card.component";
import { Location } from '@angular/common';
import { ReviewFormComponent } from '../../../review/components/review-form/review-form.component';
import { ReviewListComponent } from 'src/app/features/review/components/review-list/review-list.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, locationOutline, alertCircleOutline, createOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ModalController } from '@ionic/angular/standalone';
import { AvailabilityRulesComponent } from '../../component/availability-rules/availability-rules.component';
import { AppNavigationService } from 'src/app/core/services/app-navigation.service';
@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
  standalone: true,
  imports: [
    IonSpinner, IonToast, IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonModal,
    BookingFormComponent, StationCardComponent, ReviewFormComponent, ReviewListComponent, IonIcon
  ]
})
export class StationDetailComponent {

  readonly id = input<string>();
  private readonly idSignal = signal('');
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private readonly stationApi = inject(StationApiService);
  protected readonly bookingService = inject(BookingService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  protected station = this.stationApi.getOne(this.idSignal);
  protected navService = inject(AppNavigationService);

  readonly toastVisible = signal(false);
  readonly toastMessage = signal('');
  canReview = signal(false);

  @ViewChild('modal', { read: IonModal }) modal!: IonModal;
  @ViewChild('reviewModal', { read: IonModal }) reviewModal!: IonModal;

  constructor() {
     addIcons({arrowBackOutline,locationOutline,calendarOutline,createOutline,alertCircleOutline});
    const idFromInput = this.id();
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const realId = idFromInput ?? idFromRoute;

    if (!realId) throw new Error('ID introuvable');

    this.idSignal.set(realId);
    this.checkEligibility(realId);
  }

    isOwner = computed(() => {
    const user = this.authService.user();
    const currentStation = this.station.value();

    if (!user || !currentStation) return false;
    return user.id === currentStation.locationDTO?.userId;
  });

  checkEligibility(stationId: string) {
    this.bookingService.hasUserBookedStation(stationId).subscribe(allowed => {
      this.canReview.set(allowed);
    });
  }
// si owner modal réservation désactivé/availability activé

async openAvailabilityModal() {
    const stationId = this.station.value()?.id;
    if(!stationId) return;

    const modal = await this.modalCtrl.create({
      component: AvailabilityRulesComponent,
      componentProps: {
        preselectedStationId: stationId
      }
    });
    await modal.present();
  }

  // --- Gestion Réservation ---
  openModal() { this.modal.present(); }

  onFormSubmit($event: any) {
    const booking: BookingRequestDTO = $event.booking;
    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        this.toastMessage.set('Réservation créée ✅');
        this.toastVisible.set(true);
        this.modal.dismiss(booking, 'confirm');
      },
      error: () => {
        this.toastMessage.set('Erreur réservation ❌');
        this.toastVisible.set(true);
      }
    });
  }

  // --- Gestion Avis ---
  openReviewModal() { this.reviewModal.present(); }

  onReviewSubmitSuccess() {
    this.reviewModal.dismiss(null, 'confirm');
    this.toastMessage.set('Avis publié ! ⭐');
    this.toastVisible.set(true);

    this.station.reload();
  }
  goBack() {
    this.location.back();
  }
}
