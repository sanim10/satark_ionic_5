import { MapModalModule } from './map-modal/map-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './../weather/home/home.page';
import { FavModalModule } from './fav-modal/fav-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeatherPageRoutingModule } from './weather-routing.module';

import { WeatherPage } from './weather.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeatherPageRoutingModule,
    TranslateModule,
    FavModalModule,
    MapModalModule,
  ],
  declarations: [WeatherPage, HomePage],
})
export class WeatherPageModule {}
