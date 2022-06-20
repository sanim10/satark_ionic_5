import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportSnakebitePage } from './report-snakebite.page';

const routes: Routes = [
  {
    path: '',
    component: ReportSnakebitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportSnakebitePageRoutingModule {}
