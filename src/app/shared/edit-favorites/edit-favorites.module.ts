import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditFavoritesPageRoutingModule } from './edit-favorites-routing.module';

import { EditFavoritesPage } from './edit-favorites.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditFavoritesPageRoutingModule
  ],
  declarations: [EditFavoritesPage]
})
export class EditFavoritesPageModule {}
