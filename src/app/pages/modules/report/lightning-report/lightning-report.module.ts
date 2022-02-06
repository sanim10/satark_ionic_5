import { ReportMapModule } from './../report-map/report-map.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LightningReportPageRoutingModule } from './lightning-report-routing.module';

import { LightningReportPage } from './lightning-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LightningReportPageRoutingModule,
    TranslateModule,
    ReportMapModule,
  ],
  declarations: [LightningReportPage],
})
export class LightningReportPageModule {}
