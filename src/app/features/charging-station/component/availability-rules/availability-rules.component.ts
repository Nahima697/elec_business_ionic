import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvailabilityRulesService } from '../../services/availability-rules.service';
import { ChargingStationService } from '../../services/charging-station.service';
import { AvailabilityRuleDTO } from '../../models/availability-rules.model';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonInput, IonButton, IonLabel, IonIcon, IonList, IonSpinner
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline, arrowUpOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-availability-rules',
  templateUrl: './availability-rules.component.html',
  styleUrls: ['./availability-rules.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonInput, IonButton, IonLabel, IonIcon, IonList, IonSpinner
  ]
})
export class AvailabilityRulesComponent {
  private fb = inject(FormBuilder);
  private rulesService = inject(AvailabilityRulesService);
  private stationService = inject(ChargingStationService);

  // 1. Ressource des stations
  stationsResource = this.stationService.getChargingStations();

  // 2. Signal pour l'ID sélectionné
  selectedStationId = signal<string>('');

  // 3. Ressource des règles
  rulesResource = this.rulesService.getRulesByStation(this.selectedStationId);

  ruleForm = this.fb.group({
    dayOfWeek: [1, Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  constructor() {
    addIcons({ trashOutline, arrowUpOutline, alertCircleOutline });
  }

onSubmit() {
  const stationId = this.selectedStationId();

  if (this.ruleForm.valid && stationId) {
    const formValue = this.ruleForm.value;

    const newRule: AvailabilityRuleDTO = {
      stationId: stationId, 
      dayOfWeek: Number(formValue.dayOfWeek),
      startTime: this.formatTime(formValue.startTime!),
      endTime: this.formatTime(formValue.endTime!)
    };

    this.rulesService.createRules(newRule).subscribe({ /* ... */ });
  }
}

private formatTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}
  deleteRule(ruleId: string) {
    this.rulesService.deleteRule(ruleId).subscribe(() => {
      this.rulesResource.reload();
    });
  }

  getDayName(day: number): string {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[day - 1] || 'Inconnu';
  }
}
