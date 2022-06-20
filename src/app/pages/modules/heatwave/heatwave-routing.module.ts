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
      {
        path: 'search-location',
        loadChildren: () =>
          import('./search-location/search-location.module').then(
            (m) => m.SearchLocationPageModule
          ),
      },
    ],
  },

  {
    path: 'heatwave-map',
    loadChildren: () =>
      import('./heatwave-map/heatwave-map.module').then(
        (m) => m.HeatwaveMapPageModule
      ),
  },
  {
    path: 'map-view',
    loadChildren: () => import('./map-view/map-view.module').then( m => m.MapViewPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatwavePageRoutingModule {}
