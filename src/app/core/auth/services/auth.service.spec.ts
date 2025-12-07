import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login successfully', () => {
    const mockResponse = {
      token: 'fake-token',
      user: { id: '1', email: 'test@test.com' }
    };

    service.login('test', 'password').subscribe(response => {
      expect(response.token).toBe('fake-token');
    });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
