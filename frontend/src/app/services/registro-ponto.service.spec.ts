import { TestBed } from '@angular/core/testing';

import { RegistroPontoService } from './registro-ponto.service';

describe('RegistroPontoService', () => {
  let service: RegistroPontoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroPontoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
