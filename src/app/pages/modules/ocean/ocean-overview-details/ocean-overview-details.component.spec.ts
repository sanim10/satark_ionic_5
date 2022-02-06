import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OceanOverviewDetailsComponent } from './ocean-overview-details.component';

describe('OceanOverviewDetailsComponent', () => {
  let component: OceanOverviewDetailsComponent;
  let fixture: ComponentFixture<OceanOverviewDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OceanOverviewDetailsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OceanOverviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
