import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileDto } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
private http = inject(HttpClient);

  getMyProfile(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>('/profile');
  }

  // Mettre à jour le profil
  updateMyProfile(profile: UserProfileDto): Observable<UserProfileDto> {
    return this.http.put<UserProfileDto>('/profile', profile);
  }

  uploadAvatar(file: File): Observable<UserProfileDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UserProfileDto>(`/profile/avatar`, formData);
  }
}
