import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, NavigationEnd, Router } from '@angular/router';
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
  track: any;

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
    console.log("grupo.ngOnInit");


    this.router.events.subscribe(event => {

      console.log(event);
      if (event instanceof NavigationEnd || event instanceof ChildActivationEnd) {

        this.cargarGrupo();
      }
    });



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
            this.track = this.media.create(tracks[Math.floor(Math.random() * tracks.length)]);
            this.track.play();
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

    if (!!this.track) {
      this.track.stop();
      this.track.release();
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
          this.router.navigate(["/search"])
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
