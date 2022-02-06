import { HeatwaveMapModule } from '../heatwave-map/heatwave-map.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeatwaveStatPageRoutingModule } from './heatwave-stat-routing.module';

import { HeatwaveStatPage } from './heatwave-stat.page';
import { HeatwaveGraphModule } from '../heatwave-graph/heatwave-graph.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeatwaveStatPageRoutingModule,
    TranslateModule,
    HeatwaveGraphModule,
    HeatwaveMapModule,
  ],
  declarations: [HeatwaveStatPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeatwaveStatPageModule {}
