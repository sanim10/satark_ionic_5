import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedbackTabPageRoutingModule } from './feedback-tab-routing.module';

import { FeedbackTabPage } from './feedback-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedbackTabPageRoutingModule,
    TranslateModule,
  ],
  declarations: [FeedbackTabPage],
})
export class FeedbackTabPageModule {}
