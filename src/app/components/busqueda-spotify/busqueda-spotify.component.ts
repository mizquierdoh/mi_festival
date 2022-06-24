import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArtistSpotify } from 'src/app/entities/artist-spotify';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-busqueda-spotify',
  templateUrl: './busqueda-spotify.component.html',
  styleUrls: ['./busqueda-spotify.component.scss'],
})
export class BusquedaSpotifyComponent implements OnInit {

  @Input() name: string;
  @Input() id: string;
  resultados: ArtistSpotify[];
  offset: number;


  constructor(private modalCtr: ModalController,
    private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.resultados = [];
    if (this.name.length > 0) {
      this.search(0);
    }
  }


  async close() {
    await this.modalCtr.dismiss();
  }



  search(event?) {
    if (!event) {
      this.offset = 0;
    }
    this.spotifyService.searchGrupo(this.name, this.offset).then(busqueda => {
      console.log("Offset - " + this.offset);
      console.log(busqueda);
      const resultados: ArtistSpotify[] = busqueda.resultados;
      if (this.offset == 0) {
        this.resultados = resultados;
      } else {
        this.resultados = this.resultados.concat(resultados);
      }
      if (this.resultados.length < busqueda.total) {
        this.offset += 20;

      } else if (!!event) {
        event.target.disabled = true;
      }
      if (!!event) {
        event.target.complete();
      }
    })
  }

  get resultadosFiltrados(): ArtistSpotify[] {
    if (!this.id || this.id.length == 0) {
      return this.resultados;
    }
    return this.resultados.filter(r => r.idSpotify.includes(this.id))
  }

  async save(artist: ArtistSpotify) {
    await this.modalCtr.dismiss(artist);
  }

}
