import { SafetyInfoModule } from './safety-info/safety-info.module';
import { SafetyInfoComponent } from './safety-info/safety-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadAccidentPageRoutingModule } from './road-accident-routing.module';

import { RoadAccidentPage } from './road-accident.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoadAccidentPageRoutingModule,
    TranslateModule,
    SafetyInfoModule,
  ],
  declarations: [RoadAccidentPage],
})
export class RoadAccidentPageModule {}
