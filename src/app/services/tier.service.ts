import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tier } from '../models/tier';


@Injectable({
  providedIn: 'root'
})
export class TierService {

  private apiUrl = 'http://localhost:8082/api/tiers'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient) { }

  // Récupérer tous les tiers
  getAll(): Observable<Tier[]> {
    return this.http.get<Tier[]>(this.apiUrl);
  }

  // Créer un nouveau tier
  create(tier: Tier): Observable<Tier> {
    return this.http.post<Tier>(this.apiUrl, tier);
  }

  // Supprimer un tier par ID
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
