import { Component, inject, OnInit, output, signal, input, effect, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonDatetime,
  IonSpinner,
  ModalController } from '@ionic/angular/standalone';
import { BookingRequestDTO } from '../../models/booking';
import { BookingService } from '../../service/booking.service';
import { TimeSlotService } from '../../service/time-slot.service';
import { FormFieldComponent } from 'src/app/sharedComponent/form-field/form-field.component';
import { ControlType } from 'src/app/sharedComponent/form-field/form-field.enum.';
import { TimeSlotResponseDTO } from '../../models/timeSlot';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
  imports: [
    IonDatetime,
    IonSpinner,
    ReactiveFormsModule,
    FormFieldComponent
  ]
})
export class BookingFormComponent implements OnInit {
  private bookingService = inject(BookingService);
  private timeSlotService = inject(TimeSlotService);
  private modalCtrl = inject(ModalController);

  readonly formSubmit = output<{ booking: BookingRequestDTO }>();

  // --- SIGNALS ---
  stationId = signal<string>('');
  availableSlots = signal<TimeSlotResponseDTO[]>([]);
  startOptions = signal<{ label: string; value: string }[]>([]);
  endOptions = signal<{ label: string; value: string }[]>([]);
  loadingSlots = signal(false);
  ControlType = ControlType;

  // --- FORM ---
  form = new FormGroup({
    stationId: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    startHour: new FormControl('', Validators.required),
    endHour: new FormControl('', Validators.required),
  });

  ngOnInit() {
    console.log('BookingFormComponent initialisé');
    this.form.controls.date.valueChanges.subscribe(v => {
      console.log('valueChanges date =>', v);
    });
  }

  // appelé par StationDetail
  setStationId(id: string) {
    console.log('setStationId appelé avec:', id);
    this.stationId.set(id);
    this.form.patchValue({ stationId: id });
  }

  onDateChanged(ev: any) {
    const raw = ev.detail?.value as string | string[] | null;
    if (!raw) return;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const onlyDate = value.substring(0, 10);
    console.log('Date sélectionnée:', onlyDate);
    this.loadSlots(onlyDate);
  }

  loadSlots(date: string) {
    this.loadingSlots.set(true);
    console.log('Chargement des slots pour', this.stationId(), date);
    this.timeSlotService.getSlotsForDate(this.stationId(), date).subscribe({
      next: (res) => {
        const slots = res.content;
        console.log('Slots reçus :', slots);
        this.availableSlots.set(slots);
        this.startOptions.set(
          slots.map(s => ({
            label: s.startTime.substring(11, 16),
            value: s.startTime.substring(11, 16)
          }))
        );
        this.endOptions.set(
          slots.map(s => ({
            label: s.endTime.substring(11, 16),
            value: s.endTime.substring(11, 16)
          }))
        );
        this.loadingSlots.set(false);
      },
      error: (err) => {
        console.error('Erreur API slots', err);
        this.availableSlots.set([]);
        this.startOptions.set([]);
        this.endOptions.set([]);
        this.loadingSlots.set(false);
      }
    });
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  handleSubmit() {
    if (this.form.invalid) {
      console.log('Formulaire invalide');
      return;
    }
    const raw = this.form.getRawValue();
    console.log('Form submit =>', raw);
    const booking: BookingRequestDTO = {
      stationId: raw.stationId!,
      startDate: `${raw.date}T${raw.startHour}:00`,
      endDate: `${raw.date}T${raw.endHour}:00`
    };
    this.formSubmit.emit({ booking });
  }
}
