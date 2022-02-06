import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FloodMapPageRoutingModule } from './flood-map-routing.module';

import { FloodMapPage } from './flood-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FloodMapPageRoutingModule,
    TranslateModule,
  ],
  declarations: [FloodMapPage],
})
export class FloodMapPageModule {}
