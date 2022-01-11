import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetupProfileEmailPageRoutingModule } from './setup-profile-email-routing.module';

import { SetupProfileEmailPage } from './setup-profile-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetupProfileEmailPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  declarations: [SetupProfileEmailPage],
})
export class SetupProfileEmailPageModule {}
