import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscuchandoPage } from './escuchando.page';

const routes: Routes = [
  {
    path: '',
    component: EscuchandoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscuchandoPageRoutingModule {}
