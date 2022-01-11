import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailRegistrationPage } from './email-registration.page';

const routes: Routes = [
  {
    path: '',
    component: EmailRegistrationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRegistrationPageRoutingModule {}
