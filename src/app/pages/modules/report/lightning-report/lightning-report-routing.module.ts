import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LightningReportPage } from './lightning-report.page';

const routes: Routes = [
  {
    path: '',
    component: LightningReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LightningReportPageRoutingModule {}
