import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditFavoritesPage } from './edit-favorites.page';

const routes: Routes = [
  {
    path: '',
    component: EditFavoritesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditFavoritesPageRoutingModule {}
