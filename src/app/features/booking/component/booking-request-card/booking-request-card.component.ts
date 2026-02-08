import { Component, input, output } from '@angular/core';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonButton, IonIcon, IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, checkmarkCircleOutline, closeCircleOutline, timeOutline, personOutline, starOutline } from 'ionicons/icons';
import { BookingResponseDTO } from '../../models/booking';

@Component({
  selector: 'app-booking-request-card',
  standalone: true,
  imports: [
    CommonModule, DatePipe, CurrencyPipe,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonButton, IonIcon, IonBadge,
  ],
  template: `
    <ion-card class="mx-0 mb-4 border border-gray-100 shadow-sm rounded-xl">
      <ion-card-header class="pb-2">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <ion-card-title class="text-base font-bold text-gray-800">
              {{ booking().stationName }}
            </ion-card-title>

            <ion-card-subtitle class="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <ion-icon name="time-outline"></ion-icon>
              {{ booking().startDate | date:'dd/MM/yyyy à HH:mm' }}
            </ion-card-subtitle>
          </div>

          <ion-badge [color]="getStatusColor(booking().statusLabel)">
            {{ getStatusLabel(booking().statusLabel) }}
          </ion-badge>
        </div>
      </ion-card-header>

      <ion-card-content>
        <div class="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
          <div class="flex items-center gap-2">
            <ion-icon name="person-outline" class="text-gray-400"></ion-icon>
            <span class="font-medium text-gray-700">{{ booking().userName }}</span>
          </div>
          <span class="font-bold text-lg text-primary">
            {{ booking().totalPrice | currency:'EUR' }}
          </span>
        </div>

        @if (booking().statusLabel === 'PENDING' && isOwner()) {
          <div class="flex gap-3">
            <ion-button
              color="success"
              expand="block"
              class="flex-1 font-bold"
              mode="ios"
              (click)="onAccept.emit(booking())">
              <ion-icon slot="start" name="checkmark-circle-outline"></ion-icon>
              Accepter
            </ion-button>

            <ion-button
              color="danger"
              fill="outline"
              expand="block"
              class="flex-1 font-bold"
              mode="ios"
              (click)="onReject.emit(booking())">
              <ion-icon slot="start" name="close-circle-outline"></ion-icon>
              Refuser
            </ion-button>
          </div>
        }

        @if (booking().statusLabel === 'REJECTED') {
          <p class="text-center text-red-500 text-sm italic">Demande refusée</p>
        }

      </ion-card-content>
    </ion-card>
  `
})
export class BookingRequestCardComponent {
  booking = input.required<BookingResponseDTO>();
  isOwner = input<boolean>(false);

  onAccept = output<BookingResponseDTO>();
  onReject = output<BookingResponseDTO>();
  onDownload = output<BookingResponseDTO>();
  onReview = output<BookingResponseDTO>();

  constructor() {
    addIcons({ documentTextOutline, checkmarkCircleOutline, closeCircleOutline, timeOutline, personOutline, starOutline });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'medium';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'ACCEPTED': return 'Validée';
      case 'REJECTED': return 'Refusée';
      default: return status;
    }
  }
}
