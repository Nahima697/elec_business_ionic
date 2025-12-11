import { Component, inject, signal, computed, input, model } from '@angular/core';
import { FormFieldComponent } from 'src/app/shared-component/form-field/form-field.component';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';
import { PlatformService } from 'src/app/shared-component/services/platform.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormFieldComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private router = inject(Router);
  private platformService = inject(PlatformService);

  readonly stations = input<ChargingStationResponseDTO[]>();
  ControlType = ControlType;

  protected readonly searchFilter = signal('');

  protected readonly filteredStations = computed(() =>
    (this.stations() ?? []).filter(station =>
      station.name?.toLowerCase().includes(this.searchFilter()?.toLowerCase() ?? '') ||
      station.locationDTO?.name?.toLowerCase().includes(this.searchFilter()?.toLowerCase() ?? '')
    )
  );

   open = model.required<boolean>();

  close() {
    this.open.set(false);
  }

   openMenu() {
    this.open.set(true);
  }

  toggleMenu() {
    this.open.update(value => !value);
  }

  protected readonly links = computed(() => [
    { path: '/', name: 'Home' },
    { path: '/map', name: 'Carte' },
    { path: '/login', name: 'Se connecter' },
    { path: '/profile', name: 'Votre compte' }
  ]);

  onLocalSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value || '';
    this.searchFilter.set(inputValue);

    if (!this.platformService.isBrowser) return;

    if (this.filteredStations().length > 0) {
      this.router.navigate(['/map'], {
        state: { stations: this.filteredStations() }
      });
    }
  }
}
