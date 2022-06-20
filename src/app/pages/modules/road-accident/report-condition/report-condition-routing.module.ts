import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportConditionPage } from './report-condition.page';

const routes: Routes = [
  {
    path: '',
    component: ReportConditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportConditionPageRoutingModule {}
