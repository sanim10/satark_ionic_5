import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HydroForecastPageRoutingModule } from './hydro-forecast-routing.module';

import { HydroForecastPage } from './hydro-forecast.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HydroForecastPageRoutingModule,
    TranslateModule,
    SwiperModule,
  ],
  declarations: [HydroForecastPage],
})
export class HydroForecastPageModule {}
