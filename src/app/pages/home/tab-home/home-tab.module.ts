import { TranslateModule } from '@ngx-translate/core';
import { DrawerModule } from '../../../components/drawer/drawer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTabPageRoutingModule } from './home-tab-routing.module';

import { HomeTabPage } from './home-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DrawerModule,
    TranslateModule,
    HomeTabPageRoutingModule,
  ],
  declarations: [HomeTabPage],
})
export class HomeTabPageModule {}
