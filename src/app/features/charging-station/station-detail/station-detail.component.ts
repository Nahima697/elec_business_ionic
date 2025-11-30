import { Component, inject, input,  signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChargingStation } from 'src/app/features/charging-station/models/chargingStation.model';
import { IonButton, IonTitle, IonHeader, IonContent,IonToolbar, IonModal, IonToast, IonSpinner } from "@ionic/angular/standalone";
import { StationApiService } from 'src/app/features/charging-station/services/station-api.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { BookingFormComponent } from '../../booking/component/booking-form/booking-form.component';
import { BookingService } from '../../booking/service/booking.service';
import { BookingRequestDTO } from '../../booking/models/booking';
import { StationCardComponent } from "../component/station-card/station-card.component";
import { StationMapComponent } from "../component/station-map/station-map.component";
import { httpResource } from '@angular/common/http';
@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
    imports: [IonSpinner, IonToast,
    IonContent,
    IonHeader,
    IonTitle,
    IonButton,
    IonToolbar,
    IonModal,
    BookingFormComponent, StationCardComponent]
})
export class StationDetailComponent  {
readonly id = input<string>();
private readonly idSignal = signal('');
private readonly stationApi = inject(StationApiService);
protected station!: ReturnType<typeof httpResource<ChargingStation>>;
private bookingService= inject(BookingService);
protected readonly serverError = signal(false);
readonly toastVisible = signal(false);
readonly toastMessage = signal('');
private route = inject(ActivatedRoute);
@ViewChild('modal', { read: IonModal }) modal!: IonModal;
@ViewChild(BookingFormComponent)
bookingForm!: BookingFormComponent;

 constructor() {

    const idFromInput = this.id();

    const idFromRoute = this.route.snapshot.paramMap.get('id') ?? undefined;

    const realId = idFromInput ?? idFromRoute;

    if (!realId) {
      throw new Error('ID introuvable pour StationDetailComponent');
    }

    this.idSignal.set(realId);

    this.station = this.stationApi.getOne(this.idSignal);
  }

 openModal() {
  this.modal.present();

  const stationValue = this.station.value();
  if (stationValue) {

    setTimeout(() => {
      this.bookingForm.setStationId(stationValue.id);
    });
  }
}



  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }

  onFormSubmit($event: any) {
    const booking: BookingRequestDTO = $event.booking;
    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        this.toastMessage.set('Réservation créée avec succès ✅');
        this.toastVisible.set(true);
        this.modal.dismiss(booking, 'confirm');
      },
      error: () => {
        this.toastMessage.set('Erreur lors de la réservation ❌');
        this.toastVisible.set(true);
        this.serverError.set(true);
      }
    });
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      console.log('Demande de booking envoyé avec succes:', event.detail.data);
    }
  }

}
