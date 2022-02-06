import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FloodPage } from './flood.page';

const routes: Routes = [
  {
    path: '',
    component: FloodPage,
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
        path: 'reservior-status',
        loadChildren: () =>
          import('./reservior-status/reservior-status.module').then(
            (m) => m.ReserviorStatusPageModule
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/flood/home',
    pathMatch: 'full',
  },
  {
    path: 'map',
    loadChildren: () =>
      import('./flood-map/flood-map.module').then((m) => m.FloodMapPageModule),
  },

  {
    path: 'hydro-forecast',
    loadChildren: () =>
      import('./hydro-forecast/hydro-forecast.module').then(
        (m) => m.HydroForecastPageModule
      ),
  },

  {
    path: 'rainfall-forecast',
    loadChildren: () =>
      import('./rainfall-forecast/rainfall-forecast.module').then(
        (m) => m.RainfallForecastPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FloodPageRoutingModule {}
