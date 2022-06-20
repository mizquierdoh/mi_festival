import { Injectable } from '@angular/core';
import { Escenarios } from '../entities/escenarios';
import { Grupo } from '../entities/grupo';
import { StorageService } from './storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Horario } from '../entities/horario';
import { SpotifyService } from './spotify.service';
import { ArtistSpotify } from '../entities/artist-spotify';
import { DateUtils } from '../utils/date-utils';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  public grupos: Grupo[] = [];

  public horario: Horario[] = [];



  constructor(private storageService: StorageService,
    private spotifyService: SpotifyService) {
  }




  cargarGrupos(file: File) {
    this.grupos = [];
    this.horario = [];
    file.text().then(t => {
      const json = JSON.parse(t);
      for (const g of json["grupos"]) {
        let grupo: Grupo;
        grupo = new Grupo();
        grupo.infoSpotify = new ArtistSpotify();
        grupo.uuid = uuidv4()
        grupo.nombre = g["nombre"];
        grupo.dia = new Date(g["dia"]);
        grupo.descripcion = g["descripcion"];
        grupo.inicio = new Date(g["inicio"]);
        grupo.fin = new Date(g["fin"]);
        grupo.relevancia = g["relevancia"];
        grupo.escenario = Escenarios[g["escenario"].toUpperCase()];
        grupo.procedencia = g["procedencia"];
        grupo.infoSpotify.idSpotify = g["id_spotify"];
        this.grupos.push(grupo);



      }

      this.updateHorario(this.grupos);

      const division = Math.floor(this.grupos.length / 4);
      let promisesSpotify: Promise<ArtistSpotify[]>[] = [];
      for (let i = 0; i < 4; i++) {
        let tanda = this.grupos.filter(g => !!g.infoSpotify.idSpotify).slice(division * i, i == 3 ? -1 : division * (i + 1))
        promisesSpotify.push(this.spotifyService.getGrupos(tanda));
      }

      Promise.all(promisesSpotify).then(responses => {
        let infoSpotify = [];
        responses.forEach(r => infoSpotify = infoSpotify.concat(r));
        this.grupos.forEach(grupo => {
          const info = infoSpotify.find(i => grupo.infoSpotify.idSpotify === i.idSpotify);
          if (!!info) {
            grupo.infoSpotify = info;
          }
        });
        this.storageService.set("grupos", this.grupos);
        window.location.reload();

      });




      this.storageService.set("horario", this.horario);



    });
  }

  getGrupos(): Promise<Grupo[]> {
    if (!!this.grupos && this.grupos.length > 0) {
      return Promise.resolve(this.grupos);
    } else {
      return this.storageService.get("grupos");
    }
  }

  getHorario(): Promise<Horario[]> {
    if (!!this.horario && this.horario.length > 0) {
      return Promise.resolve(this.horario);
    } else {
      return this.storageService.get("horario");
    }
  }

  eliminarGrupo(uuid: string) {
    this.getGrupos().then(grupos => {
      this.grupos = grupos;
      let index = this.grupos.findIndex(g => g.uuid === uuid);
      if (index != -1) {
        this.grupos.splice(index, 1);
        this.updateHorario(this.grupos);
        this.storageService.set("grupos", this.grupos);
      }
    });
  }

  guardarGrupo(grupo: Grupo) {
    this.getGrupos().then(grupos => {
      this.grupos = grupos;
      let index = this.grupos.findIndex(g => g.uuid === grupo.uuid);
      if (index == -1) {
        grupo.uuid = uuidv4();
        this.grupos.push(grupo);
      } else {
        this.grupos[index] = grupo;
      }
      this.updateHorario(this.grupos);
      this.storageService.set("grupos", this.grupos);
    });
  }

  private updateHorario(grupos: Grupo[]) {
    this.horario = [];
    for (const grupo of grupos) {
      let index = this.horario.findIndex(h => DateUtils.equals(h.dia, grupo.dia));
      if (index == -1) {
        let h = new Horario();
        h.dia = grupo.dia;
        h.horas = [grupo.inicio, grupo.fin];
        this.horario.push(h);
      } else {
        if (!this.horario[index].horas.find(h => h.getTime() == grupo.inicio.getTime())) {
          this.horario[index].horas.push(grupo.inicio);
        }
        if (!this.horario[index].horas.find(h => h.getTime() == grupo.fin.getTime())) {
          this.horario[index].horas.push(grupo.fin);
        }

        this.horario = this.horario.sort((a, b) => a.dia.getTime() - b.dia.getTime());
        for (let i = 0; i < this.horario.length; i++) {
          this.horario[i].horas = this.horario[i].horas.sort((a, b) => a.getTime() - b.getTime());
        }
        this.storageService.set("horario", this.horario);
      }
    }
  }


}

