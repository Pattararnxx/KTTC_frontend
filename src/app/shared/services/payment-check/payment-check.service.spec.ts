import { TestBed } from '@angular/core/testing';

import { PaymentCheckService } from './payment-check.service';

describe('PaymentCheckService', () => {
  let service: PaymentCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
