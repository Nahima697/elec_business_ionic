import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse, UserDTO } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  // --- SIGNALS ---
  private _isLoggedIn = signal(false);
  isLoggedIn = computed(() => this._isLoggedIn());

  private _user = signal<UserDTO | null>(null);
  user = computed(() => this._user());

  private tokenKey = 'authToken';

  // ------------------------
  // TOKEN MANAGEMENT
  // ------------------------
  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  set token(value: string | null) {
    if (value) {
      this.storeToken(value);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  refreshToken(): Observable<string> {
    return this.http.post(
      '/api/refresh-token',
      {},
      {
        withCredentials: true,
        responseType: 'text'
      }
    ).pipe(
      tap((newToken: string) => {
        this.token = newToken;
        localStorage.setItem('jwt', newToken);
        console.log('Token rafraîchi avec succès');
      })
    );
  }
  // ------------------------
  // LOGIN
  // ------------------------
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

  // ------------------------
  // REGISTER
  // ------------------------
  register(username: string, email: string, password: string): Observable<AuthResponse> {
    const body = { username, email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, body, { headers });
  }

  // ------------------------
  // LOGOUT
  // ------------------------
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._user.set(null);
    this._isLoggedIn.set(false);

    this.router.navigate(['/login']);
  }

  // ------------------------
  // FETCH CURRENT USER
  // ------------------------
  fetchCurrentUser(): Observable<UserDTO | null> {
    return this.http.get<UserDTO>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this._user.set(user);
        this._isLoggedIn.set(true);
      }),
      catchError(() => {
        this._user.set(null);
        this._isLoggedIn.set(false);
        return of(null);
      })
    );
  }

  // ------------------------
  // ROLE CHECK
  // ------------------------
  hasRole(role: string): boolean {
    const u = this._user();
    if (!u) return false;
    return u.roles.some(r => r.name === role);
  }

  // ------------------------
  // PROFILE UPDATE
  // ------------------------
  updateProfile(data: Partial<UserDTO>) {
    return this.http.put<UserDTO>(`${this.apiUrl}/me`, data).pipe(
      tap(updated => this._user.set(updated))
    );
  }
}
