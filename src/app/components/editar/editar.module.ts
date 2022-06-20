import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarPageRoutingModule } from './editar-routing.module';

import { EditarPage } from './editar.page';
import { BusquedaSpotifyModule } from '../busqueda-spotify/busqueda-spotify.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarPageRoutingModule,
    BusquedaSpotifyModule
  ],
  declarations: [EditarPage]
})
export class EditarPageModule { }
