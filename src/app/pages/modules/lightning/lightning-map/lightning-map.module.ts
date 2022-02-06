import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LightningMapPageRoutingModule } from './lightning-map-routing.module';

import { LightningMapPage } from './lightning-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LightningMapPageRoutingModule,
    TranslateModule,
  ],
  declarations: [LightningMapPage],
})
export class LightningMapPageModule {}
