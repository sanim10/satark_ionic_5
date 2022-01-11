import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupProfileEmailPage } from './setup-profile-email.page';

const routes: Routes = [
  {
    path: '',
    component: SetupProfileEmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupProfileEmailPageRoutingModule {}
