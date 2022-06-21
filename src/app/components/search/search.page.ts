import { Component, OnInit } from '@angular/core';
import { ChildActivationEnd, NavigationEnd, Router } from '@angular/router';
import { Grupo } from 'src/app/entities/grupo';
import { GruposService } from 'src/app/services/grupos.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  busqueda: string;
  resultados: Grupo[] = [];
  grupos: Grupo[] = [];

  constructor(private router: Router,
    private gruposService: GruposService) { }

  ngOnInit() {
    this.busqueda = "";
    this.router.events.subscribe(event => {
      console.log(event);

      if (event instanceof NavigationEnd || event instanceof ChildActivationEnd) {
        this.cargarGrupos();
      }

    });


  }

  buscar(event) {
    this.resultados = this.grupos.filter(g => g.nombre.toLowerCase().includes(event.target.value.toLowerCase()))

  }

  cargarGrupos() {
    this.gruposService.getGrupos().then(grupos => {
      if (!!grupos) {
        this.grupos = grupos.sort((a, b) => a.nombre < b.nombre ? -1 : 1);
        this.resultados = grupos;
        if (!!this.busqueda) {
          this.resultados = this.grupos.filter(g => g.nombre.toLowerCase().includes(this.busqueda.toLowerCase()))
        }
      }

    });
  }

  clear() {
    this.resultados = this.grupos;
  }



}
