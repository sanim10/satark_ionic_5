import { TestBed } from '@angular/core/testing';

import { HomeTabService } from './home-tab.service';

describe('HomeTabService', () => {
  let service: HomeTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
