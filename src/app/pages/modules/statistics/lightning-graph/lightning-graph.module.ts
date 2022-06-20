import { TranslateModule } from '@ngx-translate/core';
import { LightningGraphComponent } from './lightning-graph.component';
import { IonicModule } from '@ionic/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LightningGraphComponent],
  imports: [CommonModule, IonicModule, TranslateModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [LightningGraphComponent],
})
export class LightningGraphModule {}
