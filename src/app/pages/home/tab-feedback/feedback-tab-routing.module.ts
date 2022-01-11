import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackTabPage } from './feedback-tab.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackTabPageRoutingModule {}
