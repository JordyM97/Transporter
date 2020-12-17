import { TestBed } from '@angular/core/testing';

import { ServicesDriverService } from './services-driver.service';

describe('ServicesDriverService', () => {
  let service: ServicesDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
