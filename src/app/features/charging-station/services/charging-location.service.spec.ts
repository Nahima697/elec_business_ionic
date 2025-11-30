import { TestBed } from '@angular/core/testing';

import { ChargingLocationService } from './charging-location.service';

describe('ChargingLocationService', () => {
  let service: ChargingLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargingLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
