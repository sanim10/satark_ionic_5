import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePage } from './profile.page';

import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, BrowserModule],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
