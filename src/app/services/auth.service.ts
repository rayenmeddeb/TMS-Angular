import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  username: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/auth/login';
 

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username: email, password }); // ⬅️ fix ici
  }

  private getAuthHeaders() {
    return { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // ✅ méthode manquante ajoutée ici
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
