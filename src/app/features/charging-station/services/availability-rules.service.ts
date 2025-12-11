import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { AvailabilityRuleDTO } from '../models/availability-rules.model'; // Garde ton import actuel
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityRulesService {
  private http = inject(HttpClient);

  private readonly PATH = '/availability_rules';

  /**
   * Récupère les règles via une ressource réactive.
   * @param stationIdSignal Le signal contenant l'ID de la station sélectionnée
   */
  getRulesByStation(stationIdSignal: Signal<string>) {
    return httpResource<AvailabilityRuleDTO[]>(() => {
      const id = stationIdSignal();
      if (!id) return undefined;
      return `${this.PATH}/${id}`;
    });
  }

  createRules(rules: AvailabilityRuleDTO): Observable<AvailabilityRuleDTO> {
    return this.http.post<AvailabilityRuleDTO>(this.PATH, rules);
  }

  updateRulesForOneStation(rules: AvailabilityRuleDTO): Observable<AvailabilityRuleDTO> {
    return this.http.put<AvailabilityRuleDTO>(this.PATH, rules);
  }

  deleteRule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.PATH}/${id}`);
  }
}
