import { TestBed } from '@angular/core/testing';
import { CanActivate } from '@angular/router';

import { MobileOnlyGuard} from './mobile-only.guard';

describe('MobileOnlyGuard', () => {
  const executeGuard: CanActivate = (...guardParameters) =>
      TestBed.runInInjectionContext(() => MobileOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
