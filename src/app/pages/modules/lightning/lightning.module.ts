import { LightningPageRoutingModule } from './lightning-routing.module';
import { LightningAdvisoryModule } from './lightning-advisory/lightning-advisory.module';
import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LightningPage } from './lightning.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LightningPageRoutingModule,
    SwiperModule,
    LightningAdvisoryModule,
  ],
  declarations: [LightningPage],
})
export class LightningPageModule {}
