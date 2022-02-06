import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FloodMapPage } from './flood-map.page';

const routes: Routes = [
  {
    path: '',
    component: FloodMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FloodMapPageRoutingModule {}
