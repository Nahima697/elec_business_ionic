import { Component, inject, OnInit, output, signal, input, effect, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonDatetime,
  IonSpinner,
  ModalController } from '@ionic/angular/standalone';
import { BookingRequestDTO } from '../../models/booking';
import { BookingService } from '../../service/booking.service';
import { TimeSlotService } from '../../service/time-slot.service';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
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
  stationId = input.required<string>();
  availableSlots = signal<TimeSlotResponseDTO[]>([]);
  startOptions = signal<{ label: string; value: string }[]>([]);
  endOptions = signal<{ label: string; value: string }[]>([]);
  loadingSlots = signal(false);
  ControlType = ControlType;

  constructor() {
  effect(() => {
    const id = this.stationId();
    if (id) {
      this.form.patchValue({ stationId: id });

    }
  });
}
  // --- FORM ---
  form = new FormGroup({
    stationId: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    startHour: new FormControl('', Validators.required),
    endHour: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.form.controls.date.valueChanges.subscribe(v => {
    });
  }

onDateChanged(ev: any) {
    const raw = ev.detail?.value as string | string[] | null;
    if (!raw) return;

    const value = Array.isArray(raw) ? raw[0] : raw;
    const onlyDate = value.substring(0, 10);

    this.form.patchValue({
      date: onlyDate,
      startHour: '',
      endHour: ''
    });
    this.loadSlots(onlyDate);
  }

  loadSlots(date: string) {
    this.loadingSlots.set(true);

    this.timeSlotService.getSlotsForDate(this.stationId(), date).subscribe({
      next: (slots) => {
        this.availableSlots.set(slots);

        const startTimes = new Set<string>();
        const endTimes = new Set<string>();

        slots.forEach(slot => {
          const startH = parseInt(slot.startTime.substring(11, 13), 10);
          const endH = parseInt(slot.endTime.substring(11, 13), 10);

          for (let h = startH; h <= endH; h++) {
            const timeStr = `${h.toString().padStart(2, '0')}:00`;

            if (h < endH) {
              startTimes.add(timeStr);
            }
            if (h > startH) {
              endTimes.add(timeStr);
            }
          }
        });

        this.startOptions.set(
          Array.from(startTimes).sort().map(t => ({ label: t, value: t }))
        );

        this.endOptions.set(
          Array.from(endTimes).sort().map(t => ({ label: t, value: t }))
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
      return;
    }
    const raw = this.form.getRawValue();
    const booking: BookingRequestDTO = {
      stationId: raw.stationId!,
      startDate: `${raw.date}T${raw.startHour}:00`,
      endDate: `${raw.date}T${raw.endHour}:00`
    };
    this.formSubmit.emit({ booking });
  }
}
