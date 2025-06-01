import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Camion {
  id?: number;
  codeCategorie: string;
  matricule: string;
  dateCreation?: string;
  dateModification?: string;
  statutEntite: string;
  acheteur: string;
  montantAchat: number;
  montantVente: number;
  typeEntite: string;
  // Ajoute d'autres champs selon besoin
}

@Injectable({
  providedIn: 'root'
})
export class CamionService {
  private apiUrl = 'http://localhost:8024/api/camions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Camion[]> {
    return this.http.get<Camion[]>(this.apiUrl);
  }

  getById(id: number): Observable<Camion> {
    return this.http.get<Camion>(`${this.apiUrl}/${id}`);
  }

  create(camion: Camion): Observable<Camion> {
    return this.http.post<Camion>(this.apiUrl, camion);
  }

  update(id: number, camion: Camion): Observable<Camion> {
    return this.http.put<Camion>(`${this.apiUrl}/${id}`, camion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
