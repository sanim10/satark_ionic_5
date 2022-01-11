import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];
@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
