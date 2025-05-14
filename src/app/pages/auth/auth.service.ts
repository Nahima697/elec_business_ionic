import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private apiUrl = environment.apiUrl;
  private _isLoggedIn = signal(this.hasToken());
  isLoggedIn = computed(() => this._isLoggedIn());

  // --- Authentification ---
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/login`, body, {
      headers,
      withCredentials: true
    });
  }

  storeToken(token: string): void {
    this.cookieService.set('authToken', token, 1, '/');
    this._isLoggedIn.set(true);
  }

  getToken(): string | null {
    return this.cookieService.get('authToken') || null;
  }

  logout(): void {
    this.cookieService.delete('authToken');
    this._isLoggedIn.set(false);
  }

  private hasToken(): boolean {
    return this.cookieService.check('authToken');
  }
}
