import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';

export interface Garden { id: string; name: string; description: string | null; widthMeters: string; heightMeters: string; }
export interface CreateGardenRequest { name: string; description?: string; widthMeters: number; heightMeters: number; }

@Injectable({ providedIn: 'root' })
export class GardenApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  getAll(): Observable<Garden[]> { return this.http.get<Garden[]>(`${this.apiBaseUrl}/gardens`); }
  getById(id: string): Observable<Garden> { return this.http.get<Garden>(`${this.apiBaseUrl}/gardens/${id}`); }
  create(request: CreateGardenRequest): Observable<Garden> { return this.http.post<Garden>(`${this.apiBaseUrl}/gardens`, request); }
}
