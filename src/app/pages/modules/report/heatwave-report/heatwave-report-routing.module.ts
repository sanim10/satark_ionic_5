import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeatwaveReportPage } from './heatwave-report.page';

const routes: Routes = [
  {
    path: '',
    component: HeatwaveReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatwaveReportPageRoutingModule {}
