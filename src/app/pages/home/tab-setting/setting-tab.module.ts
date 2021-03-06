import { ProfilePage } from './profile/profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingTabPageRoutingModule } from './setting-tab-routing.module';

import { SettingTabPage } from './setting-tab.page';
import { BackgroundGeolocation } from '@awesome-cordova-plugins/background-geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingTabPageRoutingModule,
    TranslateModule,
  ],

  providers: [BackgroundGeolocation],
  declarations: [SettingTabPage, ProfilePage],
})
export class SettingTabPageModule {}
