import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatwaveGraphComponent } from './heatwave-graph.component';

@NgModule({
  declarations: [HeatwaveGraphComponent],
  imports: [CommonModule, IonicModule, TranslateModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [HeatwaveGraphComponent],
})
export class HeatwaveGraphModule {}
