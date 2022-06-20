import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportAccidentPageRoutingModule } from './report-accident-routing.module';

import { ReportAccidentPage } from './report-accident.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportAccidentPageRoutingModule,
    TranslateModule,
  ],
  declarations: [ReportAccidentPage],
})
export class ReportAccidentPageModule {}
