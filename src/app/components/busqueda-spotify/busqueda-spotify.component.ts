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
  resultados: ArtistSpotify[];


  constructor(private modalCtr: ModalController,
    private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.resultados = [];
    if (this.name.length > 0) {
      this.search();
    }
  }


  async close() {
    await this.modalCtr.dismiss();
  }

  search() {
    this.spotifyService.searchGrupo(this.name).then(resultados => {
      this.resultados = resultados;
    })
  }

  async save(artist: ArtistSpotify) {
    await this.modalCtr.dismiss(artist);
  }

}
