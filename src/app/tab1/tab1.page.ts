import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Grupo } from '../entities/grupo';
import { GruposService } from '../services/grupos.service';
import { DateUtils } from '../utils/date-utils';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  grupos: Grupo[];
  dia: Date;
  horario: Date[];
  indexDia: number;

  constructor(private activatedRoute: ActivatedRoute,
    private gruposService: GruposService) {

  }

  ngOnInit() {
    this.grupos = [];
    const dia = this.activatedRoute.snapshot.paramMap.get('dia');
    this.gruposService.getHorario().then(horario => {
      this.indexDia = Number.isNaN(dia) ? 0 : Number.parseInt(dia);
      this.dia = horario[this.indexDia].dia;
      this.horario = horario[this.indexDia].horas.sort((a, b) => a.getTime() - b.getTime());
    });

    this.gruposService.getGrupos().then(grupos => {
      this.grupos = grupos.filter(g => DateUtils.equals(g.dia, this.dia));

    });


  }



  gruposDia(): Grupo[] {
    return this.grupos.sort((a, b) => (a.inicio.getTime() > b.inicio.getTime()) ? 1 : -1);
  }



}
