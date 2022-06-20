import { TranslateModule } from '@ngx-translate/core';
import { AdvisoryModule } from './advisory/advisory.module';
import { FirstAidModule } from './first-aid/first-aid.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SnakeBitePageRoutingModule } from './snake-bite-routing.module';
import { SnakeBitePage } from './snake-bite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SnakeBitePageRoutingModule,
    FirstAidModule,
    AdvisoryModule,
    TranslateModule,
  ],
  declarations: [SnakeBitePage],
})
export class SnakeBitePageModule {}
