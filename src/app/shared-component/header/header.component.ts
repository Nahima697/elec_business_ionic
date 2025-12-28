import { Component, inject, signal, computed, input, model } from '@angular/core';
import { ControlType } from 'src/app/shared-component/form-field/form-field.enum.';
import { Router, RouterModule } from '@angular/router';
import { ChargingStationResponseDTO } from 'src/app/features/charging-station/models/charging-station.model';
import { PlatformService } from 'src/app/shared-component/services/platform.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private router = inject(Router);
  private platformService = inject(PlatformService);
  readonly stations = input<any>();

  ControlType = ControlType;
  open = model.required<boolean>();

  protected readonly searchFilter = signal('');

  protected readonly filteredStations = computed(() => {
    const rawData = this.stations();
    let list: ChargingStationResponseDTO[] = [];

    // 1. Extraction intelligente (Tableau ou Page)
    if (rawData?.content && Array.isArray(rawData.content)) {
      list = rawData.content;
    } else if (Array.isArray(rawData)) {
      list = rawData;
    }

    // 2. Filtrage
    const filter = this.searchFilter()?.toLowerCase() ?? '';
    if (!filter) return list;

    return list.filter(station =>
      station.name?.toLowerCase().includes(filter) ||
      station.locationDTO?.addressLine?.toLowerCase().includes(filter)
    );
  });

  close() {
    this.open.set(false);
  }

  toggleMenu() {
    this.open.update(value => !value);
  }

  protected readonly links = computed(() => [
    { path: '/', name: 'Accueil' },
    { path: '/map', name: 'Carte' },
    { path: '/login', name: 'Se connecter' },
    { path: '/profile', name: 'Mon Compte' }
  ]);

  onLocalSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    const inputValue = (event as CustomEvent).detail?.value || target.value || '';

    this.searchFilter.set(inputValue);

    if (!this.platformService.isBrowser()) return;

    if (inputValue.length > 2) {
       console.log('Recherche header:', inputValue);
       this.router.navigate(['/map'], {
         state: { searchTerm: inputValue }
       });
    }
  }
}
