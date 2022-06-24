import { Component, Input, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
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
  @ViewChild(IonContent, { static: false }) content: IonContent;

  columnas: Grupo[][] = [];
  predicciones: Map<number, string>;

  grupoFinaliza: Date[] = [];

  uuid: string;

  constructor(private aemetService: AemetService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.uuid = this.activatedRoute.snapshot.paramMap.get('uuid');

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

  checkIfValidUUID(str: string) {
    // Regular expression to check if string is a valid UUID
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    return regexExp.test(str);
  }

  ngAfterViewChecked() {
    this.scrollToElement(this.uuid);

  }

  private scrollToElement(id: string) {
    let element = document.getElementById(id);

    if (!!element) {

      let yOffset = element.offsetTop;
      let xOffset = element.offsetLeft;
      this.content.scrollToPoint(xOffset, yOffset, 500);

    }
  }





}
