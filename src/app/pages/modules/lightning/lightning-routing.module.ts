import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LightningPage } from './lightning.page';

const routes: Routes = [
  {
    path: '',
    component: LightningPage,
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
    path: 'lightning-map',
    loadChildren: () =>
      import('./lightning-map/lightning-map.module').then(
        (m) => m.LightningMapPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LightningPageRoutingModule {}
