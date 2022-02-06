import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FloodPageRoutingModule } from './flood-routing.module';

import { FloodPage } from './flood.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FloodPageRoutingModule,
    TranslateModule,
  ],
  declarations: [FloodPage],
})
export class FloodPageModule {}
