import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, tap, catchError, of, BehaviorSubject, filter, take, switchMap } from 'rxjs';
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
  private refreshTokenKey = 'refreshToken';

  // 🔒 Protection contre les refreshs multiples simultanés
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  // ------------------------
  // TOKEN MANAGEMENT
  // ------------------------
  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  private storeRefreshToken(token: string) {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getRefreshTokenFromStorage(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  set token(value: string | null) {
    if (value) {
      this.storeToken(value);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * 🔥 Méthode de refresh corrigée pour éviter la boucle infinie
   */
  refreshToken(): Observable<any> {
    // Si un refresh est déjà en cours, on attend qu'il se termine
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => of({ token }))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = this.getRefreshTokenFromStorage();

    if (!refreshToken) {
      this.isRefreshing = false;
      this.logout();
      throw new Error('No refresh token available');
    }
    return this.http.post<{ token: string; refreshToken?: string }>(
      `/refresh-token`,
      { refreshToken },
      {
        withCredentials: true,
        // On peut aussi ajouter un header spécial pour skip l'interceptor
        headers: new HttpHeaders({ 'X-Skip-Interceptor': 'true' })
      }
    ).pipe(
      tap((response) => {
        this.isRefreshing = false;

        // Stocker le nouveau token
        if (response.token) {
          this.storeToken(response.token);
          this.refreshTokenSubject.next(response.token);
        }

        // Si un nouveau refresh token est fourni
        if (response.refreshToken) {
          this.storeRefreshToken(response.refreshToken);
        }

        console.log('✅ Token rafraîchi avec succès');
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);

        console.error('❌ Échec du refresh token', error);

        // Déconnecter l'utilisateur si le refresh échoue
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, body, { headers }).pipe(
      tap((response) => {
        this.storeToken(response.token);

        // Stocker le refresh token s'il est fourni
        if ((response as any).refreshToken) {
          this.storeRefreshToken((response as any).refreshToken);
        }

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
    localStorage.removeItem(this.refreshTokenKey);
    this._user.set(null);
    this._isLoggedIn.set(false);
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);
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

  // ------------------------
  // AUTH CHECK
  // ------------------------
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
