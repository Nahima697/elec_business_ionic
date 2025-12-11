import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AvailabilityRuleDTO } from '../models/availability-rules.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityRulesService {

private http = inject(HttpClient);
  getRulesByStation()  {
    return httpResource<AvailabilityRuleDTO[]>(()=>`/availability_rules`);
  }

  createRules(rules: AvailabilityRuleDTO) : Observable<AvailabilityRuleDTO>{
    return this.http.post<AvailabilityRuleDTO>('/availability_rules/',rules);
  }

  updateRulesForOneStation(rules: AvailabilityRuleDTO) : Observable<AvailabilityRuleDTO> {
    return this.http.put<AvailabilityRuleDTO>(`/availability_rules/`,rules);
  }

  deleteRule(id:string) {
    return this.http.delete<AvailabilityRuleDTO>(`/availability_rules/${id}`);
  }

}
