import { TestBed } from '@angular/core/testing';

import { MediaServicesService } from './media-services.service';

describe('MediaServicesService', () => {
  let service: MediaServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
