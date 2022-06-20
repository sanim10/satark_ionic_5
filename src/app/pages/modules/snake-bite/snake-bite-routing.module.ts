import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SnakeBitePage } from './snake-bite.page';

const routes: Routes = [
  {
    path: '',
    component: SnakeBitePage,
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
    path: 'report-snakebite',
    loadChildren: () => import('./report-snakebite/report-snakebite.module').then( m => m.ReportSnakebitePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SnakeBitePageRoutingModule {}
