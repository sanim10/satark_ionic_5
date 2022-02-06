import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherMapPage } from './weather-map.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherMapPageRoutingModule {}
