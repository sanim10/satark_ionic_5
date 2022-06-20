import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NearbyHospitalService {
  clicked: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  SOS: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {}
}
