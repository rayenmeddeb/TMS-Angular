import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ordre } from '../models/ordre';


@Injectable({
  providedIn: 'root'
})
export class OrdreService {
  private baseUrl = 'http://localhost:8025/api/ot';

  constructor(private http: HttpClient) {}

  getAllOrdres(): Observable<Ordre[]> {
    return this.http.get<Ordre[]>(this.baseUrl);
  }
}