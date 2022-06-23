import { Component, Input, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Escenarios } from 'src/app/entities/escenarios';
import { Grupo } from 'src/app/entities/grupo';
import { AemetService } from 'src/app/services/aemet.service';

@Component({
  selector: 'app-tabla-tiempo',
  templateUrl: './tabla-tiempo.component.html',
  styleUrls: ['./tabla-tiempo.component.scss'],
})
export class TablaTiempoComponent implements OnInit {
  @Input() grupos: Grupo[];
  @Input() horas: Date[];

  columnas: Grupo[][] = [];
  predicciones: Map<number, string>;

  grupoFinaliza: Date[] = [];

  constructor(private aemetService: AemetService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.predicciones = new Map<number, string>();
    this.aemetService.getPrediccionHoraria().then(predicciones => {
      for (let i = 0; i < this.horas.length; i++) {
        const prediccion = this.aemetService.getPrediccion(this.horas[i], predicciones);
        if (!!prediccion && !!prediccion.estadoCielo) {
          this.predicciones.set(this.horas[i].getTime(), `/assets/aemet/${prediccion.estadoCielo}.png`);
        } else {
          this.predicciones.set(this.horas[i].getTime(), "");
        }
      }
    });
  }


  getRowspan(grupo: Grupo): number {
    return this.horas.findIndex(h => h.getTime() === grupo.fin.getTime()) - this.horas.findIndex(h => h.getTime() === grupo.inicio.getTime());
  }

  getColumnas(h: number): Grupo[] {
    const hora = new Date(h);
    let columnas: Grupo[] = this.grupos.filter(g => g.inicio.getTime() == hora.getTime()).sort((a, b) => {
      const resultado = b.relevancia - a.relevancia;
      if (resultado == 0) {
        return Object.values(Escenarios).indexOf(a.escenario) > Object.values(Escenarios).indexOf(b.escenario) ? 1 : -1;
      } else {
        return resultado;
      }
    });

    return columnas;
  }

  isNow(_hora: number): boolean {
    const h = this.horas.findIndex(hora => hora.getTime() == _hora);
    if (h == -1 || h == this.horas.length + 1) {
      return false;
    }
    let now: Date = new Date();
    if (this.horas[h].getTime() <= now.getTime() && this.horas[h + 1].getTime() > now.getTime()) {
      return true;
    }
    return false;


  }





}
