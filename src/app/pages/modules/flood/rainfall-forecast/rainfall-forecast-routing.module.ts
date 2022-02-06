import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RainfallForecastPage } from './rainfall-forecast.page';

const routes: Routes = [
  {
    path: '',
    component: RainfallForecastPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RainfallForecastPageRoutingModule {}
