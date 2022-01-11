import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailRegistrationPageRoutingModule } from './email-registration-routing.module';

import { EmailRegistrationPage } from './email-registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailRegistrationPageRoutingModule,
    SwiperModule,
    TranslateModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [EmailRegistrationPage],
})
export class EmailRegistrationPageModule {}
