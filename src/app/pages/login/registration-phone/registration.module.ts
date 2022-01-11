import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyModule } from './../../../shared/privacy-policy/privacy-policy.module';
import { SwiperModule } from 'swiper/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationPageRoutingModule,
    SwiperModule,
    PrivacyPolicyModule,
    TranslateModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [RegistrationPage],
})
export class RegistrationPageModule {}
