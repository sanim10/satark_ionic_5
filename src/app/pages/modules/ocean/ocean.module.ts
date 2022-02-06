import { OceanOverviewDetailsModule } from './ocean-overview-details/ocean-overview-details.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OceanPageRoutingModule } from './ocean-routing.module';

import { OceanPage } from './ocean.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OceanPageRoutingModule,
    TranslateModule,
    OceanOverviewDetailsModule,
  ],
  declarations: [OceanPage],
})
export class OceanPageModule {}
