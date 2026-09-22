import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';

export interface TreeSpecies {
  id: string;
  name: string;
}

export interface GardenTree {
  id: string;
  label: string;
  x: string;
  y: string;
  species: TreeSpecies;
  _count: { grafts: number };
}

export interface TreeDetails extends GardenTree {
  notes: string | null;
  plantingDate: string | null;
  grafts: Array<{ id: string; status: 'ACTIVE' | 'INACTIVE' | 'REMOVED'; variety: { id: string; name: string } }>;
}

export interface MapReferenceObject {
  id: string;
  type: 'BUILDING' | 'FENCE';
  label: string | null;
  x: string;
  y: string;
  widthMeters: string | null;
  heightMeters: string | null;
  endX: string | null;
  endY: string | null;
}

@Injectable({ providedIn: 'root' })
export class GardenMapApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  getTrees(gardenId: string): Observable<GardenTree[]> {
    return this.http.get<GardenTree[]>(`${this.apiBaseUrl}/gardens/${gardenId}/trees`);
  }

  getMapObjects(gardenId: string): Observable<MapReferenceObject[]> {
    return this.http.get<MapReferenceObject[]>(`${this.apiBaseUrl}/gardens/${gardenId}/map-objects`);
  }

  getTree(id: string): Observable<TreeDetails> {
    return this.http.get<TreeDetails>(`${this.apiBaseUrl}/trees/${id}`);
  }
}
