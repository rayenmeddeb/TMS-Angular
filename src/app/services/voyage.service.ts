import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Voyage } from '../models/voyage';


@Injectable({
  providedIn: 'root'
})
export class VoyageService {
  private apiUrl = 'http://localhost:8025/api/voyages'; // Adjust if needed

  constructor(private http: HttpClient) {}

  saveVoyage(voyage: Voyage): Observable<Voyage> {
    return this.http.post<Voyage>(this.apiUrl, voyage);
  }

  getAllVoyages(): Observable<Voyage[]> {
  
    return this.http.get<Voyage[]>(this.apiUrl);
  }
}