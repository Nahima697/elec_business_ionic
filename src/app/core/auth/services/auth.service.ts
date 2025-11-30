import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { Router } from '@angular/router';
import { PlatformService } from 'src/app/sharedComponent/services/platform.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformService = inject(PlatformService);
  private apiUrl = environment.apiUrl;

  private _isLoggedIn = signal(false);
  isLoggedIn = computed(() => this._isLoggedIn());

  private _user = signal<AuthResponse['user'] | null>(null);
  user = computed(() => this._user());

  private tokenKey = 'authToken';

  private storeToken(token: string) {
    if (this.platformService.isMobile()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body, { headers }).pipe(
      tap((response) => {
        this.storeToken(response.token);
        this._user.set(response.user);
        this._isLoggedIn.set(true);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const body = { username, email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, body, { headers });
  }

  logout(): void {
    if (this.platformService.isMobile()) {
      localStorage.removeItem(this.tokenKey);
    }
    this._user.set(null);
    this._isLoggedIn.set(false);
    if (this.platformService.isBrowser()) {
      this.router.navigate(['login']);
    }
  }

  fetchCurrentUser(): Observable<AuthResponse['user'] | null> {
    return this.http.get<AuthResponse['user']>(`${this.apiUrl}/me`).pipe(
      tap(user => this._user.set(user)),
      catchError(() => {
        this._user.set(null);
        this._isLoggedIn.set(false);
        return of(null);
      })
    );
  }

  updateProfile(data: Partial<AuthResponse['user']>) {
  return this.http.put<AuthResponse['user']>(`${this.apiUrl}/me`, data).pipe(
    tap(updated => {
      this._user.set(updated);
    })
  );
}

}
