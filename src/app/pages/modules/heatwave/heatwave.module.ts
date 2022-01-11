import { TranslateModule } from '@ngx-translate/core';
import { FavModalModule } from './fav-modal/fav-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeatwavePageRoutingModule } from './heatwave-routing.module';

import { HeatwavePage } from './heatwave.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeatwavePageRoutingModule,
    FavModalModule,
    TranslateModule,
  ],
  declarations: [HeatwavePage],
})
export class HeatwavePageModule {}
