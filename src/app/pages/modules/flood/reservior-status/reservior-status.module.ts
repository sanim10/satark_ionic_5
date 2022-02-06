import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReserviorStatusPageRoutingModule } from './reservior-status-routing.module';

import { ReserviorStatusPage } from './reservior-status.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReserviorStatusPageRoutingModule,
    TranslateModule,
  ],
  declarations: [ReserviorStatusPage],
})
export class ReserviorStatusPageModule {}
