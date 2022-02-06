import { IonicModule } from '@ionic/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatwaveGraphComponent } from './heatwave-graph.component';

@NgModule({
  declarations: [HeatwaveGraphComponent],
  imports: [CommonModule, IonicModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [HeatwaveGraphComponent],
})
export class HeatwaveGraphModule {}
