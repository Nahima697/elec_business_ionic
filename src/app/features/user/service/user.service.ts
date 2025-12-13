import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfileDto, UserRoleDTO } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getMe(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.api}/me`);
  }

  addRole(userId: string, roleName: string): Observable<void> {
    let endpoint = '';

    if (roleName.includes('OWNER')) {
      endpoint = 'owner';
    } else if (roleName.includes('RENTER')) {
      endpoint = 'renter';
    } else {
      console.error("Rôle inconnu :", roleName);
      throw new Error("Rôle non supporté par l'API");
    }

    return this.http.post<void>(`${this.api}/users/${userId}/roles/${endpoint}`, {});
  }

  removeRole(userId: string, roleName: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/users/${userId}/roles/${roleName}`);
  }
}
