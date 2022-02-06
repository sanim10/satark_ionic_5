import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportPage } from './report.page';

const routes: Routes = [
  {
    path: '',
    component: ReportPage,
  },
  {
    path: 'heatwave-report',
    loadChildren: () => import('./heatwave-report/heatwave-report.module').then( m => m.HeatwaveReportPageModule)
  },
  {
    path: 'lightning-report',
    loadChildren: () => import('./lightning-report/lightning-report.module').then( m => m.LightningReportPageModule)
  },
  {
    path: 'flood-report',
    loadChildren: () => import('./flood-report/flood-report.module').then( m => m.FloodReportPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportPageRoutingModule {}
