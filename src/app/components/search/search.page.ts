import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/entities/grupo';
import { GruposService } from 'src/app/services/grupos.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  busqueda: string = "";
  resultados: Grupo[] = [];
  grupos: Grupo[] = [];

  constructor(private gruposService: GruposService) { }

  ngOnInit() {
    this.gruposService.getGrupos().then(grupos => {
      if (!!grupos) {
        this.grupos = grupos.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        this.resultados = grupos;
      }

    });
  }

  buscar(event) {
    this.resultados = this.grupos.filter(g => g.nombre.toLowerCase().includes(event.target.value.toLowerCase()))

  }



}
