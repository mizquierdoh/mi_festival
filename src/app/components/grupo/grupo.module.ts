import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrupoPageRoutingModule } from './grupo-routing.module';

import { GrupoPage } from './grupo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GrupoPageRoutingModule
  ],
  declarations: [GrupoPage],
  providers: [DatePipe]
})
export class GrupoPageModule { }
