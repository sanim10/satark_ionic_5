import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OceanPage } from './ocean.page';

const routes: Routes = [
  {
    path: '',
    component: OceanPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OceanPageRoutingModule {}
