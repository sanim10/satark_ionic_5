import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HydroForecastPage } from './hydro-forecast.page';

const routes: Routes = [
  {
    path: '',
    component: HydroForecastPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HydroForecastPageRoutingModule {}
