import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';
import { IonButton, IonTitle, IonHeader, IonContent, IonToolbar, IonModal, IonToast, IonSpinner, IonIcon } from "@ionic/angular/standalone";
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';
import { BookingFormComponent } from '../../../booking/component/booking-form/booking-form.component';
import { BookingService } from '../../../booking/service/booking.service';
import { BookingRequestDTO } from '../../../booking/models/booking';
import { StationCardComponent } from "../../component/station-card/station-card.component";
import { httpResource } from '@angular/common/http';
import { reviewResponseDTO } from '../../../review/models/review.model';
import { ReviewFormComponent } from '../../../review/components/review-form/review-form.component';
import { ReviewListComponent } from 'src/app/features/review/components/review-list/review-list.component';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
  standalone: true,
  imports: [
    IonSpinner, IonToast, IonContent, IonHeader, IonTitle, IonButton, IonToolbar, IonModal,
    BookingFormComponent, StationCardComponent, ReviewFormComponent, ReviewListComponent
  ]
})
export class StationDetailComponent {
  readonly id = input<string>();
  private readonly idSignal = signal('');

  private readonly stationApi = inject(StationApiService);
  protected readonly bookingService = inject(BookingService);
  private route = inject(ActivatedRoute);

  // Ressource unique : La station (qui contient déjà les avis)
  protected station = this.stationApi.getOne(this.idSignal);

  readonly toastVisible = signal(false);
  readonly toastMessage = signal('');
  canReview = signal(false);

  @ViewChild('modal', { read: IonModal }) modal!: IonModal;
  @ViewChild('reviewModal', { read: IonModal }) reviewModal!: IonModal;

  constructor() {
    const idFromInput = this.id();
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const realId = idFromInput ?? idFromRoute;

    if (!realId) throw new Error('ID introuvable');

    this.idSignal.set(realId);
    this.checkEligibility(realId);
  }

  checkEligibility(stationId: string) {
    this.bookingService.hasUserBookedStation(stationId).subscribe(allowed => {
      this.canReview.set(allowed);
    });
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
}
