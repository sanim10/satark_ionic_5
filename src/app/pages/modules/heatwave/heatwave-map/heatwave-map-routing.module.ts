import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeatwaveMapPage } from './heatwave-map.page';

const routes: Routes = [
  {
    path: '',
    component: HeatwaveMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatwaveMapPageRoutingModule {}
