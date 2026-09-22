import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/api.config';
import { GardenMapApiService } from './garden-map-api.service';

describe('GardenMapApiService', () => {
  let service: GardenMapApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GardenMapApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test/api' },
      ],
    });
    service = TestBed.inject(GardenMapApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads trees for a garden', () => {
    service.getTrees('garden-1').subscribe();

    const request = http.expectOne('http://api.test/api/gardens/garden-1/trees');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('loads visual map objects for a garden', () => {
    service.getMapObjects('garden-1').subscribe();

    const request = http.expectOne('http://api.test/api/gardens/garden-1/map-objects');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
