import { TranslateModule } from '@ngx-translate/core';
import { FavModalComponent } from './fav-modal.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    TranslateModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [FavModalComponent],
})
export class FavModalModule {}
