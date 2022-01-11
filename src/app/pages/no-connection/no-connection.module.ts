import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoConnectionPageRoutingModule } from './no-connection-routing.module';

import { NoConnectionPage } from './no-connection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoConnectionPageRoutingModule,
    TranslateModule,
  ],
  declarations: [NoConnectionPage],
})
export class NoConnectionPageModule {}
