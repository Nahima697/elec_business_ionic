import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Observable,
  tap,
  catchError,
  of,
  BehaviorSubject,
  filter,
  take,
  switchMap,
} from 'rxjs';
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

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  // ------------------------
  // REFRESH TOKEN (cookie only)
  // ------------------------
  refreshToken(): Observable<any> {

    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => of({ token }))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.http
      .post<{ token: string }>(
        `/refresh-token`,
        {},
        { withCredentials: true } // le refresh token est dans le cookie
      )
      .pipe(
        tap(response => {
          this.isRefreshing = false;

          if (response.token) {
            this.refreshTokenSubject.next(response.token);
          }
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);

          console.error('❌ Échec du refresh token', error);
          this.logout();

          throw error;
        })
      );
  }

  // ------------------------
  // LOGIN
  // ------------------------
  login(username: string, password: string): Observable<AuthResponse> {

    const body = { username, password };

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, body, {
        withCredentials: true // pour que le backend pose le refresh cookie
      })
      .pipe(
        tap(response => {
          this._user.set(response.user);
          this._isLoggedIn.set(true);
        })
      );
  }

  // ------------------------
  // REGISTER
  // ------------------------
  register(
    username: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {

    const body = { username, email, password };

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      body,
      { withCredentials: true }
    );
  }

  // ------------------------
  // LOGOUT
  // ------------------------
  logout(): void {
    this._user.set(null);
    this._isLoggedIn.set(false);
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);

    this.router.navigate(['/login']);
  }

  // ------------------------
  // RESET PASSWORD
  // ------------------------
  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }

  confirmResetPassword(userId: string, token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password/confirm`, {
      userId,
      token,
      newPassword,
    });
  }

  // ------------------------
  // FETCH CURRENT USER
  // ------------------------
  fetchCurrentUser(): Observable<UserDTO | null> {
    return this.http.get<UserDTO>(`${this.apiUrl}/me`, {
      withCredentials: true
    }).pipe(
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
    return this.http
      .put<UserDTO>(`${this.apiUrl}/me`, data, { withCredentials: true })
      .pipe(tap(updated => this._user.set(updated)));
  }

  // ------------------------
  // AUTH CHECK
  // ------------------------
  isAuthenticated(): boolean {
    return this._isLoggedIn();
  }
}
