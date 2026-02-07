import { Component, computed, inject, input, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonButton, IonTitle, IonHeader, IonContent, IonToolbar, IonModal, IonToast, IonSpinner, IonIcon, ViewDidEnter,IonFooter, IonButtons, IonBackButton } from "@ionic/angular/standalone";
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';
import { BookingFormComponent } from '../../../booking/component/booking-form/booking-form.component';
import { BookingService } from '../../../booking/service/booking.service';
import { BookingRequestDTO } from '../../../booking/models/booking';
import { StationCardComponent } from "../../component/station-card/station-card.component";
import { Location } from '@angular/common';
import { ReviewFormComponent } from '../../../review/components/review-form/review-form.component';
import { ReviewListComponent } from 'src/app/features/review/components/review-list/review-list.component';
import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline, locationOutline, alertCircleOutline, createOutline, starOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ModalController } from '@ionic/angular/standalone';
import { AvailabilityRulesComponent } from '../../component/availability-rules/availability-rules.component';
import { AppNavigationService } from 'src/app/core/services/app-navigation.service';
import { StationFormComponent } from '../../component/station-form/station-form.component';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons,
    IonSpinner, IonToast, IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonModal,
    BookingFormComponent, StationCardComponent, ReviewFormComponent, ReviewListComponent, IonIcon,IonFooter
  ]
})
export class StationDetailComponent implements ViewDidEnter {

  readonly id = input<string>();
  private readonly idSignal = signal('');
  private authService = inject(AuthService);
  private modalCtrl = inject(ModalController);
  private readonly stationApi = inject(StationApiService);
  protected readonly bookingService = inject(BookingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  protected station = this.stationApi.getOne(this.idSignal);
  protected navService = inject(AppNavigationService);

  readonly toastVisible = signal(false);
  readonly toastMessage = signal('');
  canReview = signal(false);

  private shouldOpenReviewModal = false;

  @ViewChild('modal', { read: IonModal }) modal!: IonModal;
  @ViewChild('reviewModal', { read: IonModal }) reviewModal!: IonModal;

  constructor() {
    addIcons({calendarOutline,createOutline,starOutline,locationOutline,alertCircleOutline,arrowBackOutline});

    const idFromInput = this.id();
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const realId = idFromInput ?? idFromRoute;

    if (!realId) throw new Error('ID introuvable');

    this.idSignal.set(realId);
    this.checkEligibility(realId);

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { openReview: boolean } | undefined;

    if (state?.openReview) {
      this.shouldOpenReviewModal = true;
    }
  }

  ionViewDidEnter() {
    if (this.shouldOpenReviewModal) {
      this.shouldOpenReviewModal = false;
      this.openReviewModal();
    }
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

  async openAvailabilityModal() {
    const currentStation = this.station.value();

    if (!currentStation) return;

    const modal = await this.modalCtrl.create({
      component: AvailabilityRulesComponent,
      componentProps: {
        stationId: currentStation.id
      }
    });
    await modal.present();
  }

  async openEditModal() {
    const currentStation = this.station.value();
    if (!currentStation) return;

    const modal = await this.modalCtrl.create({
      component: StationFormComponent,
      componentProps: {
        id: currentStation.id,
        locationId: currentStation.locationDTO?.id
      }
    });

    await modal.present();

    const { role } = await modal.onDidDismiss();
    if (role === 'confirm') {
      this.station.reload();
      this.toastMessage.set('Station mise à jour');
      this.toastVisible.set(true);
    }
  }

  openModal() { this.modal.present(); }

  onFormSubmit($event: any) {
    const booking: BookingRequestDTO = $event.booking;
    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        this.toastMessage.set('Réservation créée');
        this.toastVisible.set(true);
        this.modal.dismiss(booking, 'confirm');
      },
      error: () => {
        this.toastMessage.set('Erreur réservation');
        this.toastVisible.set(true);
      }
    });
  }

  openReviewModal() {
    if (this.reviewModal) {
      this.reviewModal.present();
    }
  }

  onReviewSubmitSuccess() {
    this.reviewModal.dismiss(null, 'confirm');
    this.toastMessage.set('Avis publié !');
    this.toastVisible.set(true);

    this.station.reload();
  }

  goBack() {
    this.location.back();
  }
}
