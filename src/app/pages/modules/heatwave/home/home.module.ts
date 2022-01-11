import { Routes, RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
