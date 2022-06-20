import { TestBed } from '@angular/core/testing';

import { NearbyHospitalService } from './nearby-hospital.service';

describe('NearbyHospitalService', () => {
  let service: NearbyHospitalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NearbyHospitalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
