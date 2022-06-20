import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';
import { AdvisoryComponent } from './advisory.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AdvisoryComponent],
  imports: [CommonModule, SwiperModule, TranslateModule],
  exports: [AdvisoryComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AdvisoryModule {}
