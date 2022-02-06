import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RainfallForecastPageRoutingModule } from './rainfall-forecast-routing.module';

import { RainfallForecastPage } from './rainfall-forecast.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RainfallForecastPageRoutingModule,
    SwiperModule,
    TranslateModule,
  ],
  declarations: [RainfallForecastPage],
})
export class RainfallForecastPageModule {}
