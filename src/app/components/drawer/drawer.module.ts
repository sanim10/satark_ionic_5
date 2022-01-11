import { TranslateModule } from '@ngx-translate/core';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { DrawerComponent } from './drawer.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DrawerComponent],
  imports: [CommonModule, IonicModule, SwiperModule, TranslateModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [DrawerComponent],
})
export class DrawerModule {}
