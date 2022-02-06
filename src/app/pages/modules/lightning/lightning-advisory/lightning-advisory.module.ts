import { TranslateModule } from '@ngx-translate/core';
import { LightningAdvisoryComponent } from './lightning-advisory.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [LightningAdvisoryComponent],
  imports: [CommonModule, SwiperModule, TranslateModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [LightningAdvisoryComponent],
})
export class LightningAdvisoryModule {}
