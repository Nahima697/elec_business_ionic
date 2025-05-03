import { TestBed } from '@angular/core/testing';
import { CanActivate } from '@angular/router';

import { platformGuard } from './mobile-only.guard';

describe('platformGuard', () => {
  const executeGuarD: CanActivate = (...guardParameters) =>
      TestBed.runInInjectionContext(() => platformGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
