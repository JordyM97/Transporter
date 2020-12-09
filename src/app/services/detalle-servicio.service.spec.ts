import { TestBed } from '@angular/core/testing';

import { DetalleServicioService } from './detalle-servicio.service';

describe('DetalleServicioService', () => {
  let service: DetalleServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
