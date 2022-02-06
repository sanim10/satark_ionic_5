import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeatherMapPageRoutingModule } from './weather-map-routing.module';

import { WeatherMapPage } from './weather-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeatherMapPageRoutingModule,
    TranslateModule,
  ],
  declarations: [WeatherMapPage],
})
export class WeatherMapPageModule {}
