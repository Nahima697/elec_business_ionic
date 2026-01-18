import { Component, input, output } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { IonCard, IonCardHeader, IonCardContent, IonChip, IonButton, IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { BookingResponseDTO } from '../../models/booking';

@Component({
  selector: 'app-booking-request-card',
  standalone: true,
  imports: [DatePipe, IonCard, UpperCasePipe, IonCardHeader, IonCardContent, IonChip, IonButton, IonIcon],
  template: `
    <ion-card class="mb-4 shadow-sm border-l-4" [class.border-green-500]="booking().statusLabel === 'ACCEPTED'" [class.border-red-500]="booking().statusLabel === 'REJECTED'">
      <ion-card-header class="pb-2">
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg">{{ booking().stationId }}</span> <ion-chip [color]="getStatusColor(booking().statusLabel)">
            {{ booking().statusLabel | uppercase }}
          </ion-chip>
        </div>
      </ion-card-header>

      <ion-card-content>
        <div class="flex flex-col gap-2 mb-3">
          <div class="flex items-center text-gray-600">
            <ion-icon name="calendar-outline" class="mr-2"></ion-icon>
            <span>{{ booking().startDate | date:'dd MMM yyyy, HH:mm' }}</span>
          </div>

          <div class="flex items-center text-gray-600">
            <ion-icon name="time-outline" class="mr-2"></ion-icon>
            <span>Durée : {{ getDuration(booking().startDate, booking().endDate) }}h</span>
          </div>
        </div>

        @if (isOwner() && booking().statusLabel === 'PENDING') {
          <div class="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <ion-button size="small" color="success" class="flex-1" (click)="onAccept.emit(booking())">
              Accepter
            </ion-button>
            <ion-button size="small" color="danger" fill="outline" class="flex-1" (click)="onReject.emit(booking())">
              Refuser
            </ion-button>
          </div>
        }
      </ion-card-content>
    </ion-card>
  `
})
export class BookingRequestCardComponent {
  readonly booking = input.required<BookingResponseDTO>();
  readonly isOwner = input<boolean>(false); 

  // Outputs pour remonter l'action au parent
  readonly onAccept = output<BookingResponseDTO>();
  readonly onReject = output<BookingResponseDTO>();

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'medium';
    }
  }

  getDuration(start: string, end: string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.round((e - s) / (1000 * 60 * 60) * 10) / 10;
  }
}
