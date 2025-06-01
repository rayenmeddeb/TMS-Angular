import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site } from '../models/site';


@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = 'http://localhost:8026/api/sites';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Site[]> {
    return this.http.get<Site[]>(this.apiUrl);
  }

  create(site: Site): Observable<Site> {
    return this.http.post<Site>(this.apiUrl, site);
  }

  update(id: number, site: Site): Observable<Site> {
    return this.http.put<Site>(`${this.apiUrl}/${id}`, site);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<Site> {
    return this.http.get<Site>(`${this.apiUrl}/${id}`);
  }
}