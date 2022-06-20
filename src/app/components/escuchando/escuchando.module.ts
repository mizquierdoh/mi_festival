import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscuchandoPageRoutingModule } from './escuchando-routing.module';

import { EscuchandoPage } from './escuchando.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscuchandoPageRoutingModule
  ],
  declarations: [EscuchandoPage]
})
export class EscuchandoPageModule {}
