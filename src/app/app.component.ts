import { Component } from '@angular/core';
import { AemetService } from './services/aemet.service';
import { GruposService } from './services/grupos.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  public appPages = [];
  constructor(private gruposService: GruposService, private aemetService: AemetService) {
  }
  cargarGrupos(files) {
    const file = files.item(0);

    this.gruposService.cargarGrupos(file);

  }

  saveGrupos() {
    this.gruposService.saveGrupos();
  }

  ngOnInit() {
    this.appPages = [
      { title: 'Busqueda', url: '', icon: 'search' },
      { title: 'Horario', url: '/tabs', icon: 'calendar' }
    ];
  }

}
