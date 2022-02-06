import { HomePage } from './home/home.page';
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
        component: HomePage,
        // loadChildren: () =>
        //   import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
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
export class WeatherPageRoutingModule {}
