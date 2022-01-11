import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupProfilePhonePageRoutingModule } from './setup-profile-phone-routing.module';

import { SetupProfilePhonePage } from './setup-profile-phone.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SetupProfilePhonePageRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [SetupProfilePhonePage],
})
export class SetupProfilePhonePageModule {}
