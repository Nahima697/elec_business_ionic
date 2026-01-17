import { Component, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlType } from './form-field.enum.';
import { CommonModule } from '@angular/common';
import {
  IonInput, IonSearchbar, IonTextarea, IonSelect, IonSelectOption,
  IonDatetime, IonLabel, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonInput,
    IonSearchbar,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonLabel,
    IonIcon
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() controlType: ControlType = ControlType.Input;
  @Input() formControl?: FormControl;
  @Input() options: { label: string; value: any }[] = [];

  value: any = '';
  isDisabled = false;
  ControlType = ControlType;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    addIcons({ alertCircleOutline }); 
  }

  setValue(event: any) {
    this.value = event.detail?.value ?? event.target?.value;
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  getErrorMessage(): string {
    if (this.formControl?.hasError('required')) return 'Ce champ est obligatoire';
    if (this.formControl?.hasError('email')) return 'Email invalide';
    if (this.formControl?.hasError('minlength')) {
      const min = this.formControl.errors?.['minlength'].requiredLength;
      return `Minimum ${min} caractères`;
    }
    // Gestion spécifique mot de passe
    if (this.formControl?.hasError('passwordMismatch')) return 'Les mots de passe ne correspondent pas';

    return 'Champ invalide';
  }
}
