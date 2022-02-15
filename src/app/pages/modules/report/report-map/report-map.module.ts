import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { ReportMapComponent } from './report-map.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ReportMapComponent],
  imports: [CommonModule, IonicModule, TranslateModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [ReportMapComponent],
})
export class ReportMapModule {}
