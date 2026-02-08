import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvailabilityRulesService } from '../../services/availability-rules.service';
import { ChargingStationService } from '../../services/charging-station.service';
import { AvailabilityRuleDTO } from '../../models/availability-rules.model';
import {
  IonHeader, IonToolbar, IonButtons, IonTitle, IonContent,
  IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonInput, IonButton, IonLabel, IonIcon, IonList,
  IonSpinner, ModalController, ToastController
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline, closeOutline, timeOutline, calendarOutline, addCircleOutline, arrowUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-availability-rules',
  templateUrl: './availability-rules.component.html',
  styleUrls: ['./availability-rules.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonButtons, IonTitle, IonContent,
    IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonInput, IonButton, IonLabel, IonIcon, IonList,
    IonSpinner
  ]
})
export class AvailabilityRulesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rulesService = inject(AvailabilityRulesService);
  private stationService = inject(ChargingStationService);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  // 1. Signal interne pour l'ID sélectionné
  selectedStationId = signal<string>('');

  // 2. Input Setter : C'est LUI qui reçoit la valeur de la Modale et met à jour le signal
  @Input() set stationId(value: string) {
    if (value) {
      this.selectedStationId.set(value);
    }
  }

  // 3. Ressource des stations
  stationsResource = this.stationService.getMyStations();

  rulesResource = this.rulesService.getRulesByStation(this.selectedStationId);

  ruleForm = this.fb.group({
    dayOfWeek: [1, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  constructor() {
    addIcons({ trashOutline, closeOutline, timeOutline, calendarOutline, addCircleOutline, arrowUpOutline });
  }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    const currentId = this.selectedStationId();

    if (this.ruleForm.valid && currentId) {
      const formValue = this.ruleForm.value;

      const newRule: AvailabilityRuleDTO = {
        stationId: currentId,
        dayOfWeek: Number(formValue.dayOfWeek),
        startTime: this.formatTime(formValue.startTime!),
        endTime: this.formatTime(formValue.endTime!)
      };

      this.rulesService.createRules(newRule).subscribe({
        next: async () => {
          this.rulesResource.reload();
          this.ruleForm.patchValue({ startTime: '', endTime: '' });
          const toast = await this.toastCtrl.create({
            message: 'Disponibilité ajoutée avec succès !',
            duration: 2000,
            color: 'success',
            position: 'top'
          });
          toast.present();
        },
        error: async (err) => {
          console.error(err);
          const toast = await this.toastCtrl.create({
            message: 'Erreur lors de l\'ajout. Vérifiez les horaires.',
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        }
      });
    }
  }

  deleteRule(ruleId: string) {
    this.rulesService.deleteRule(ruleId).subscribe({
      next: async () => {
        this.rulesResource.reload();
        const toast = await this.toastCtrl.create({
            message: 'Règle supprimée',
            duration: 1500,
            color: 'success',
            position: 'top'
        });
        toast.present();
      },
      error: async (err) => {
        console.error(err);
        const toast = await this.toastCtrl.create({
          message: 'Impossible de supprimer cette règle.',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }

  private formatTime(time: string): string {
    return time && time.length === 5 ? `${time}:00` : time;
  }

  getDayName(day: number): string {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[day - 1] || 'Jour ' + day;
  }
}
