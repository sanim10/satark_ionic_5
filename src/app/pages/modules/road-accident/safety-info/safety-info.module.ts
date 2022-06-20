import { SwiperModule } from 'swiper/angular';
import { SafetyInfoComponent } from './safety-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SafetyInfoComponent],
  imports: [CommonModule, TranslateModule, SwiperModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [SafetyInfoComponent],
})
export class SafetyInfoModule {}
