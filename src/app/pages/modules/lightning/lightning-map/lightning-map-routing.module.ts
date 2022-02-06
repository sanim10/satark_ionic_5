import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LightningMapPage } from './lightning-map.page';

const routes: Routes = [
  {
    path: '',
    component: LightningMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LightningMapPageRoutingModule {}
