import { ReportMapModule } from './../report-map/report-map.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FloodReportPageRoutingModule } from './flood-report-routing.module';

import { FloodReportPage } from './flood-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FloodReportPageRoutingModule,
    TranslateModule,
    ReportMapModule,
  ],
  declarations: [FloodReportPage],
})
export class FloodReportPageModule {}
