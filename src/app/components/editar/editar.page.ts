import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Grupo } from 'src/app/entities/grupo';
import { GruposService } from 'src/app/services/grupos.service';
import { Escenarios } from "../../entities/escenarios";
import { Location } from '@angular/common';
import { DateTimeUtils } from 'src/app/utils/date-time-utils';
import { ArtistSpotify } from 'src/app/entities/artist-spotify';
import { ModalController } from '@ionic/angular';
import { TablaTiempoComponent } from '../tabla-tiempo/tabla-tiempo.component';
import { BusquedaSpotifyComponent } from '../busqueda-spotify/busqueda-spotify.component';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

  grupo: Grupo;
  escenarios: string[];
  escenario: string;
  fechaDia;
  fechaInicio;
  fechaFin;

  busquedaAbierta: boolean = false;

  modalDataResponse: any;


  constructor(private gruposService: GruposService,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private router: Router) {
    this.escenarios = Object.keys(Escenarios);

  }

  ngOnInit() {
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');


    this.grupo = new Grupo();
    if (!!uuid) {
      this.gruposService.getGrupos().then(grupos => {
        this.grupo = grupos.find(g => g.uuid === uuid);
        if (!this.grupo) {
          this.grupo = new Grupo();
          this.grupo.infoSpotify = new ArtistSpotify();
        } else {
          this.escenario = this.grupo.escenario ? this.grupo.escenario.toUpperCase() : "";
          this.fechaDia = !!this.grupo.dia ? DateTimeUtils.toIsoString(this.grupo.dia) : DateTimeUtils.toIsoString(new Date());
          this.fechaInicio = !!this.grupo.inicio ? DateTimeUtils.toIsoString(this.grupo.inicio) : DateTimeUtils.toIsoString(new Date());;
          this.fechaFin = !!this.grupo.fin ? DateTimeUtils.toIsoString(this.grupo.fin) : DateTimeUtils.toIsoString(new Date());;
        }
      });
    }
  }

  guardarGrupo() {
    this.grupo.escenario = Escenarios[this.escenario];
    this.grupo.dia = new Date(this.fechaDia);
    this.grupo.inicio = new Date(this.fechaInicio);
    this.grupo.fin = new Date(this.fechaFin);
    this.gruposService.guardarGrupo(this.grupo).then(() => this.cancelar());


  }

  cancelar() {
    let url = "/search";
    if (!!this.activatedRoute.snapshot.paramMap.get('uuid')) {
      url = '/grupo/' + this.grupo.uuid;
    }
    this.router.navigateByUrl(url, {
      replaceUrl: true
    });
  }

  cleanSpotify() {
    this.grupo.infoSpotify = new ArtistSpotify();
  }

  async initModal() {
    const modal = await this.modalController.create({
      component: BusquedaSpotifyComponent,
      componentProps: {
        'name': this.grupo.nombre,
        'id': !!this.grupo.infoSpotify ? this.grupo.infoSpotify.idSpotify : ""
      }
    });

    modal.onDidDismiss().then((response: OverlayEventDetail<ArtistSpotify>) => {
      if (!!response && !!response.data) {
        this.grupo.infoSpotify = response.data;
      }
    });

    return await modal.present();
  }




}
