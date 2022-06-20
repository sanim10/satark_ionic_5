import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportConditionPageRoutingModule } from './report-condition-routing.module';

import { ReportConditionPage } from './report-condition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReportConditionPageRoutingModule,
  ],
  declarations: [ReportConditionPage],
})
export class ReportConditionPageModule {}
