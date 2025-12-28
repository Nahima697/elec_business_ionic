import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileDto } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
private http = inject(HttpClient);

  // Récupérer le profil connecté
  getMyProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>('/profile');
  }

  // Mettre à jour le profil
  updateMyProfile(profile: UserProfileDto): Observable<UserProfileDto> {
    return this.http.put<UserProfileDto>('/profile', profile);
  }
}
