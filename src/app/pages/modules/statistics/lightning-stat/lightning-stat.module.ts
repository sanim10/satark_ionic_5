import { SwiperModule } from 'swiper/angular';
import { LightningGraphModule } from './../lightning-graph/lightning-graph.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LightningStatPageRoutingModule } from './lightning-stat-routing.module';

import { LightningStatPage } from './lightning-stat.page';
import { LightningMapModule } from '../lightning-map/lightning-map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LightningStatPageRoutingModule,
    TranslateModule,
    LightningGraphModule,
    LightningMapModule,
    SwiperModule,
  ],
  declarations: [LightningStatPage],
})
export class LightningStatPageModule {}
