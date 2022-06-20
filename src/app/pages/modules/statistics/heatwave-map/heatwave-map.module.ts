import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HeatwaveMapComponent } from './heatwave-map.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HeatwaveMapComponent],
  imports: [CommonModule, TranslateModule, FormsModule, IonicModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [HeatwaveMapComponent],
})
export class HeatwaveMapModule {}
