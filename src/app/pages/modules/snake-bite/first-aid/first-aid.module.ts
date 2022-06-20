import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstAidComponent } from './first-aid.component';

@NgModule({
  declarations: [FirstAidComponent],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, TranslateModule, SwiperModule],
  exports: [FirstAidComponent],
})
export class FirstAidModule {}
