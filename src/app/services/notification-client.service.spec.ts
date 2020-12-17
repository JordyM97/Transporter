import { TestBed } from '@angular/core/testing';

import { NotificationClientService } from './notification-client.service';

describe('NotificationClientService', () => {
  let service: NotificationClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
