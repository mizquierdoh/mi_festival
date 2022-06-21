import { Component, ViewEncapsulation } from '@angular/core';
import { GruposService } from './services/grupos.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {

  public appPages = [];
  constructor(private gruposService: GruposService) {
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
