import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  private _isLoggedIn = signal(this.hasToken());
  isLoggedIn = computed(() => this._isLoggedIn());

  private _user = signal<AuthResponse['user'] | null>(null);
  user = computed(() => this._user());

  constructor() {
    if (this.hasToken()) {
      this.getToken();
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body, {
      headers,
      withCredentials: true
    }).pipe(
      tap((response: AuthResponse) => {
        this.storeToken(response.token);
        this._user.set(response.user);
        this._isLoggedIn.set(true);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const body = { username, email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, body, {
      headers,
      withCredentials: true
    });
  }

  logout(): void {
    this.cookieService.delete('authToken');
    this._user.set(null);
    this._isLoggedIn.set(false);
  }

  getToken(): string | null {
    return this.cookieService.get('authToken') || null;
  }

  private hasToken(): boolean {
    return !! this.getToken();
  }

  private storeToken(token: string): void {
    this.cookieService.set('authToken', token, 1, '/');
    this._isLoggedIn.set(true);
  }

  refreshToken(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/refreshToken`,
      null,
      { withCredentials: true }
    ).pipe(
      tap(response => this.storeToken(response.message)),
      catchError(error => {
        if (error.status === 403) {
          this.logout();
          this.router.navigate(['login']);
        }
        throw error;
      })
    );
}

  fetchCurrentUser(): Observable<AuthResponse['user'] | null> {
    return this.http.get<AuthResponse['user']>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap(user => this._user.set(user)),
      catchError(() => {
        this._user.set(null);
        this._isLoggedIn.set(false);
        return of(null);
      })
    );
  }
}
