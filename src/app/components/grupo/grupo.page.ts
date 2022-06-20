import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Grupo } from 'src/app/entities/grupo';
import { AemetService } from 'src/app/services/aemet.service';
import { GruposService } from 'src/app/services/grupos.service';
import { DateUtils } from 'src/app/utils/date-utils';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.page.html',
  styleUrls: ['./grupo.page.scss']
})
export class GrupoPage implements OnInit {

  grupo: Grupo;
  tab: number;

  constructor(private activatedRoute: ActivatedRoute,
    private gruposService: GruposService,
    private aemetService: AemetService,
    public alertController: AlertController,
    private router: Router) {


  }

  ngOnInit() {
    const uuid = this.activatedRoute.snapshot.paramMap.get('uuid');
    this.gruposService.getGrupos().then(grupos => {
      this.grupo = grupos.find(g => g.uuid === uuid);
      if (!!this.grupo) {
        this.gruposService.getHorario().then(dias => {
          this.tab = dias.findIndex(d => DateUtils.equals(this.grupo.dia, d.dia));
        });

        this.aemetService.getPrediccionHoraria().then(predicciones =>
          this.grupo.prediccion = this.aemetService.getPrediccion(this.grupo.inicio, predicciones)
        );
      }
    });


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
