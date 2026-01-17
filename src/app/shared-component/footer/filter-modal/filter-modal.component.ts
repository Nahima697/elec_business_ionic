import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonFooter, IonButton, IonContent, IonCol, AnimationController,
  ModalController, IonIcon, IonGrid, IonRow
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { closeOutline, filterOutline } from 'ionicons/icons';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { ControlType } from '../../form-field/form-field.enum.';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    FormFieldComponent,
    IonIcon,
    IonCol,
    IonFooter
  ],
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  private animationCtrl = inject(AnimationController);
  private modalCtrl = inject(ModalController);

  ControlType: typeof ControlType = ControlType;

  openPlace = false;
  openTrajet = false;
  openDate = false;

  placeControl = new FormControl('');
  trajetControl = new FormControl('');
  dateControl = new FormControl('');

  selectedPlace = '';
  selectedTrajet = '';
  selectedDate: string | null = null;

  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    addIcons({ filterOutline, closeOutline });
  }

  ngOnInit() {
    this.placeControl.valueChanges.subscribe(val => this.selectedPlace = val || '');
    this.trajetControl.valueChanges.subscribe(val => this.selectedTrajet = val || '');
    this.dateControl.valueChanges.subscribe(val => {
        this.selectedDate = val ? new Date(val).toLocaleDateString() : null;
    });
  }

  applyFilters() {
    const filters = {
      place: this.placeControl.value || this.selectedPlace,
      trajet: this.trajetControl.value || this.selectedTrajet,
      date: this.dateControl.value || this.selectedDate,
    };

    console.log('Filtres appliqués :', filters);

    // On ferme la modale en renvoyant les données
    this.modalCtrl.dismiss(filters, 'confirm');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // Animation d'entrée (Ta méthode personnalisée)
  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;
    const backdropAnimation = this.animationCtrl.create()
      .addElement(root!.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl.create()
      .addElement(root!.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl.create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(300)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
}
