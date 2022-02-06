import { LightningMapComponent } from './lightning-map.component';
import { LightningGraphComponent } from './../lightning-graph/lightning-graph.component';
import { IonicModule } from '@ionic/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LightningMapComponent],
  imports: [CommonModule, IonicModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [LightningMapComponent],
})
export class LightningMapModule {}
