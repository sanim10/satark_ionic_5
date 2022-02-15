import { HomePage } from './home/home.page';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherPage } from './weather.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherPage,
    children: [
      {
        path: 'home',
        component: HomePage,
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
    path: 'weather-map',
    loadChildren: () =>
      import('./weather-map/weather-map.module').then(
        (m) => m.WeatherMapPageModule
      ),
  },
  {
    path: 'map-view',
    loadChildren: () =>
      import('./map-view/map-view.module').then((m) => m.MapViewPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherPageRoutingModule {}
