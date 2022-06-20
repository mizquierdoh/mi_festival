import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusquedaSpotifyComponent } from './busqueda-spotify.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [BusquedaSpotifyComponent],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  exports: [BusquedaSpotifyComponent]
})
export class BusquedaSpotifyModule { }
