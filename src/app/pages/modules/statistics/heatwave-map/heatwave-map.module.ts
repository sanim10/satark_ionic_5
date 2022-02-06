import { HeatwaveMapComponent } from './heatwave-map.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HeatwaveMapComponent],
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [HeatwaveMapComponent],
})
export class HeatwaveMapModule {}
