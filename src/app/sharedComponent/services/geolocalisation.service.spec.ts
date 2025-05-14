import { TestBed } from '@angular/core/testing';

import { GeolocalisationService } from '../services/geolocalisation.service';

describe('GeolocalisationService', () => {
  let service: GeolocalisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeolocalisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
