import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chauffeur } from '../models/chauffeur.model';

@Injectable({
  providedIn: 'root',
})
export class ChauffeurService {
  private apiUrl = 'http://localhost:8023/api/chauffeurs';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAllChauffeurs(): Observable<Chauffeur[]> {
    return this.http.get<Chauffeur[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getChauffeurById(id: number): Observable<Chauffeur> {
    return this.http.get<Chauffeur>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  addChauffeur(chauffeurData: Chauffeur): Observable<Chauffeur> {
    return this.http.post<Chauffeur>(`${this.apiUrl}/ajout`, chauffeurData, {
      headers: this.getHeaders(),
    });
  }

  updateChauffeur(id: number, chauffeur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, chauffeur, {
      headers: this.getHeaders(),
    });
  }

  deleteChauffeur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  filtrerChauffeurs(codeSite: string, tempsConduite: number, dateDeVoyage: string): Observable<Chauffeur[]> {
    let params = new HttpParams()
      .set('codeSite', codeSite)
      .set('tempsConduite', tempsConduite.toString())
      .set('dateDeVoyage', dateDeVoyage);
    return this.http.get<Chauffeur[]>(`${this.apiUrl}/filtrer`, {
      headers: this.getHeaders(),
      params,
    });
  }
}