import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadAccidentPage } from './road-accident.page';

const routes: Routes = [
  {
    path: '',
    component: RoadAccidentPage,
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
    path: 'report-accident',
    loadChildren: () =>
      import('./report-accident/report-accident.module').then(
        (m) => m.ReportAccidentPageModule
      ),
  },
  {
    path: 'report-condition',
    loadChildren: () =>
      import('./report-condition/report-condition.module').then(
        (m) => m.ReportConditionPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadAccidentPageRoutingModule {}
