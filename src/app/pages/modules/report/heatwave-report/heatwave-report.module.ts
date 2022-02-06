import { ReportMapModule } from '../report-map/report-map.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeatwaveReportPageRoutingModule } from './heatwave-report-routing.module';

import { HeatwaveReportPage } from './heatwave-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeatwaveReportPageRoutingModule,
    TranslateModule,
    ReportMapModule,
  ],
  declarations: [HeatwaveReportPage],
})
export class HeatwaveReportPageModule {}
