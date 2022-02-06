import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatisticsPage } from './statistics.page';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPage
  },
  {
    path: 'heatwave-stat',
    loadChildren: () => import('./heatwave-stat/heatwave-stat.module').then( m => m.HeatwaveStatPageModule)
  },
  {
    path: 'lightning-stat',
    loadChildren: () => import('./lightning-stat/lightning-stat.module').then( m => m.LightningStatPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsPageRoutingModule {}
