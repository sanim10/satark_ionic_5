import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportAccidentPage } from './report-accident.page';

const routes: Routes = [
  {
    path: '',
    component: ReportAccidentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportAccidentPageRoutingModule {}
