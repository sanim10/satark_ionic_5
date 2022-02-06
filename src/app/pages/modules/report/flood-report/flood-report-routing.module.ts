import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FloodReportPage } from './flood-report.page';

const routes: Routes = [
  {
    path: '',
    component: FloodReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FloodReportPageRoutingModule {}
