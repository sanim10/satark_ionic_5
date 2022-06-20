import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportSnakebitePageRoutingModule } from './report-snakebite-routing.module';

import { ReportSnakebitePage } from './report-snakebite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportSnakebitePageRoutingModule,
    TranslateModule,
  ],
  declarations: [ReportSnakebitePage],
})
export class ReportSnakebitePageModule {}
