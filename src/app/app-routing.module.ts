import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'setup-profile-phone',
    redirectTo: 'splash',
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
    path: 'lightning/lightning-map',
    loadChildren: () =>
      import(
        './pages/modules/lightning/lightning-map/lightning-map.module'
      ).then((m) => m.LightningMapPageModule),
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
    path: 'weather/weather-map',
    loadChildren: () =>
      import('./pages/modules/weather/weather-map/weather-map.module').then(
        (m) => m.WeatherMapPageModule
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
    // canActivate: [AuthGuard],
  },
  {
    path: 'setup-profile-email',
    loadChildren: () =>
      import(
        './pages/login/setup-profile-email/setup-profile-email.module'
      ).then((m) => m.SetupProfileEmailPageModule),
    // canActivate: [AuthGuard],
  },
  {
    path: 'report',
    loadChildren: () =>
      import('./pages/modules/report/report.module').then(
        (m) => m.ReportPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'statistics',
    loadChildren: () =>
      import('./pages/modules/statistics/statistics.module').then(
        (m) => m.StatisticsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'flood',
    loadChildren: () =>
      import('./pages/modules/flood/flood.module').then(
        (m) => m.FloodPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ocean',
    loadChildren: () =>
      import('./pages/modules/ocean/ocean.module').then(
        (m) => m.OceanPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'road-accident',
    loadChildren: () =>
      import('./pages/modules/road-accident/road-accident.module').then(
        (m) => m.RoadAccidentPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/modules/snake-bite/home/home.module').then(
        (m) => m.HomePageModule
      ),
  },
  {
    path: 'snake-bite',
    loadChildren: () =>
      import('./pages/modules/snake-bite/snake-bite.module').then(
        (m) => m.SnakeBitePageModule
      ),
    canActivate: [AuthGuard],
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
