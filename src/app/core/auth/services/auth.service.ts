import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private apiUrl = environment.apiUrl;

  private _isLoggedIn = signal(this.hasToken());
  isLoggedIn = computed(() => this._isLoggedIn());

  private _user = signal<AuthResponse['user'] | null>(null);
  user = computed(() => this._user());

  constructor() {
    if (this.hasToken()) {
      this.fetchCurrentUser().subscribe();
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
    return this.cookieService.check('authToken');
  }

  private storeToken(token: string): void {
    this.cookieService.set('authToken', token, 1, '/');
    this._isLoggedIn.set(true);
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
