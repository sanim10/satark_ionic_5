import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LightningStatPage } from './lightning-stat.page';

const routes: Routes = [
  {
    path: '',
    component: LightningStatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LightningStatPageRoutingModule {}
