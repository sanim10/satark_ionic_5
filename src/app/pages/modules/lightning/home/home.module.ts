import { TranslateModule } from '@ngx-translate/core';
import { FavModalModule } from '../fav-modal/fav-modal.module';
import { SwiperModule } from 'swiper/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SwiperModule,
    FavModalModule,
    TranslateModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
