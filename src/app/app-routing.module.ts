import { HomeTabPage } from './pages/home/tab-home/home-tab.page';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule, Component } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    // redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login-phone/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./pages/splash-screen/splash-screen.module').then(
        (m) => m.SplashScreenPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/host/host.module').then((m) => m.HostPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'home/home-tab',
    loadChildren: () =>
      import('./pages/home/tab-home/home-tab.module').then(
        (m) => m.HomeTabPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home/feedback-tab',
    loadChildren: () =>
      import('./pages/home/tab-feedback/feedback-tab.module').then(
        (m) => m.FeedbackTabPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home/setting-tab',
    loadChildren: () =>
      import('./pages/home/tab-setting/setting-tab.module').then(
        (m) => m.SettingTabPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'heatwave',
    loadChildren: () =>
      import('./pages/modules/heatwave/heatwave.module').then(
        (m) => m.HeatwavePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'heatwave/home',
    loadChildren: () =>
      import('./pages/modules/heatwave/home/home.module').then(
        (m) => m.HomePageModule
      ),
  },

  {
    path: 'lightning',
    loadChildren: () =>
      import('./pages/modules/lightning/lightning.module').then(
        (m) => m.LightningPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'lightning/home',
    loadChildren: () =>
      import('./pages/modules/lightning/home/home.module').then(
        (m) => m.HomePageModule
      ),
  },

  {
    path: 'weather',
    loadChildren: () =>
      import('./pages/modules/weather/weather.module').then(
        (m) => m.WeatherPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'weather/home',
    loadChildren: () =>
      import('./pages/modules/weather/home/home.module').then(
        (m) => m.HomePageModule
      ),
  },

  {
    path: 'edit-favorites',
    loadChildren: () =>
      import('./shared/edit-favorites/edit-favorites.module').then(
        (m) => m.EditFavoritesPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'no-connection',
    loadChildren: () =>
      import('./pages/no-connection/no-connection.module').then(
        (m) => m.NoConnectionPageModule
      ),
  },
  {
    path: 'setup-profile-phone',
    loadChildren: () =>
      import(
        './pages/login/setup-profile-phone/setup-profile-phone.module'
      ).then((m) => m.SetupProfilePhonePageModule),
  },
  {
    path: 'setup-profile-email',
    loadChildren: () =>
      import(
        './pages/login/setup-profile-email/setup-profile-email.module'
      ).then((m) => m.SetupProfileEmailPageModule),
  },
];

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
