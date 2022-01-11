import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
  {
    path: 'email-login',
    loadChildren: () =>
      import('../login-email/email-login.module').then(
        (m) => m.EmailLoginPageModule
      ),
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('../registration-phone/registration.module').then(
        (m) => m.RegistrationPageModule
      ),
  },
  {
    path: 'email-registration',
    loadChildren: () =>
      import('../registration-email/email-registration.module').then(
        (m) => m.EmailRegistrationPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
