import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeatwavePage } from './heatwave.page';

const routes: Routes = [
  {
    path: '',
    component: HeatwavePage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'heatwave-map',
    loadChildren: () => import('./heatwave-map/heatwave-map.module').then( m => m.HeatwaveMapPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatwavePageRoutingModule {}
