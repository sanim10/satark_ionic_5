import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeatwaveMapPageRoutingModule } from './heatwave-map-routing.module';

import { HeatwaveMapPage } from './heatwave-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeatwaveMapPageRoutingModule,
    TranslateModule,
  ],
  declarations: [HeatwaveMapPage],
})
export class HeatwaveMapPageModule {}
