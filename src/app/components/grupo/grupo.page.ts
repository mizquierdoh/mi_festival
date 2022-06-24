import { Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Media } from '@ionic-native/media/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { Grupo } from 'src/app/entities/grupo';
import { AemetService } from 'src/app/services/aemet.service';
import { GruposService } from 'src/app/services/grupos.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { DateUtils } from 'src/app/utils/date-utils';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.page.html',
  styleUrls: ['./grupo.page.scss']
})
export class GrupoPage implements OnInit {

  grupo: Grupo;
  tab: number;
  tracks: any[];
  track: number;
  isPlaying: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private gruposService: GruposService,
    private aemetService: AemetService,
    public alertController: AlertController,
    private router: Router,
    private spotifyService: SpotifyService, public platform: Platform, private media: Media, private elementRef: ElementRef
  ) {

    console.log("grupo.constructor");

  }

  ngOnInit() {
    this.cargarGrupo();

  }

  editar() {
    this.router.navigateByUrl('/editar/' + this.grupo.uuid, {
      replaceUrl: true
    });

  }

  next() {

    this.tracks[this.track].stop();
    this.tracks[this.track].release();

    this.track++;
    if (this.track >= this.tracks.length) {
      this.track = 0;
    }
    this.play();
  }


  play() {
    console.log("play");
    if (!!this.track) {
      this.tracks[this.track].play();
      this.isPlaying = true;
    }
  }

  pause() {
    console.log("pause");

    if (!!this.track) {
      this.tracks[this.track].pause();
      this.isPlaying = false;
    }
  }

  cargarGrupo() {
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');

    this.gruposService.getGrupos().then(grupos => {
      this.grupo = grupos.find(g => g.uuid === uuid);
      if (!!this.grupo) {
        this.gruposService.getHorario().then(dias => {
          this.tab = dias.findIndex(d => DateUtils.equals(this.grupo.dia, d.dia));
        });
        if (!!this.grupo.infoSpotify) {
          this.spotifyService.getTopTracks(this.grupo.infoSpotify.idSpotify).then(tracks => {

            this.tracks = tracks.map(t => this.media.create(t));
            this.track = 0;

          });
        }


        this.aemetService.getPrediccionHoraria().then(predicciones =>
          this.grupo.prediccion = this.aemetService.getPrediccion(this.grupo.inicio, predicciones)
        );
      }
    });
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    console.log("grupo.ngOnDestroy");

    if (!!this.tracks && !!this.tracks[this.track]) {
      this.tracks[this.track].stop();
      this.tracks[this.track].release();
    }

    this.elementRef.nativeElement.remove();
  }



  async presentAlert() {
    const alert = await this.alertController.create({
      message: "¿Eliminar este grupo?",
      buttons: [{
        text: 'OK',
        handler: () => {
          this.gruposService.eliminarGrupo(this.grupo.uuid);
          this.router.navigate(["/search"], {
            replaceUrl: true
          });
        }
      }, 'Cancelar']
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  navegarAemet() {
    try {
      window.open('http://www.aemet.es/es/eltiempo/prediccion/municipios/horas/viveiro-id27066', '_system');
    } catch (e) {
      console.log(e);
      window.location.reload();
    }
  }

  navegarSpotify() {
    try {
      window.open('https://open.spotify.com/artist/' + this.grupo.infoSpotify.idSpotify, '_system');
    } catch (e) {
      console.log(e);
      window.location.reload();
    }
  }

  refresh() {
    this.aemetService.getPrediccionesTotales().then(predicciones => {
      this.grupo.prediccion = this.aemetService.getPrediccion(this.grupo.inicio, predicciones);
    });
  }



}
