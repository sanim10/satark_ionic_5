import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostPage } from './host.page';

const routes: Routes = [
  {
    path: '',
    component: HostPage,
    children: [
      {
        path: 'home-tab',
        loadChildren: () =>
          import('../tab-home/home-tab.module').then(
            (m) => m.HomeTabPageModule
          ),
      },
      {
        path: 'feedback-tab',
        loadChildren: () =>
          import('../tab-feedback/feedback-tab.module').then(
            (m) => m.FeedbackTabPageModule
          ),
      },
      {
        path: 'setting-tab',
        loadChildren: () =>
          import('../tab-setting/setting-tab.module').then(
            (m) => m.SettingTabPageModule
          ),
      },

      {
        path: '',
        redirectTo: '/home/home-tab',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/home-tab',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
