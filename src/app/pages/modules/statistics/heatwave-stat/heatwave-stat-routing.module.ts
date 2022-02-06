import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeatwaveStatPage } from './heatwave-stat.page';

const routes: Routes = [
  {
    path: '',
    component: HeatwaveStatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatwaveStatPageRoutingModule {}
