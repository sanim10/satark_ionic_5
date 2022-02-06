import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReserviorStatusPage } from './reservior-status.page';

const routes: Routes = [
  {
    path: '',
    component: ReserviorStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserviorStatusPageRoutingModule {}
