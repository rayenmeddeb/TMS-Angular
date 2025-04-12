// src/app/services/chauffeur.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChauffeurService {
  private apiUrl = 'http://localhost:8082/api/chauffeurs'; // ➤ À adapter si besoin

  constructor(private http: HttpClient) {}

  // 🔐 Récupérer les headers avec le token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ✅ Obtenir tous les chauffeurs (authentifié)
  getAllChauffeurs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Obtenir un chauffeur par son ID (authentifié)
  getChauffeurById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Ajouter un chauffeur avec une photo (authentifié)
  addChauffeur(chauffeurData: any, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('chauffeur', JSON.stringify(chauffeurData));
    formData.append('photo', photo);

    // ⚠️ Ne pas définir manuellement le Content-Type pour FormData
    return this.http.post(this.apiUrl, formData, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Mettre à jour un chauffeur (authentifié)
  updateChauffeur(id: number, chauffeur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, chauffeur, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Supprimer un chauffeur (authentifié)
  deleteChauffeur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
