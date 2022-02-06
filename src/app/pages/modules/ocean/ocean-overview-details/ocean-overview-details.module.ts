import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OceanOverviewDetailsComponent } from './../ocean-overview-details/ocean-overview-details.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OceanOverviewDetailsComponent],
  imports: [CommonModule, IonicModule, TranslateModule],
  exports: [OceanOverviewDetailsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class OceanOverviewDetailsModule {}
