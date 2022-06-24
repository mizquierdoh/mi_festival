import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Horario } from './entities/horario';
import { GruposService } from './services/grupos.service';
import { DateUtils } from './utils/date-utils';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {

  public appPages = [];
  constructor(private gruposService: GruposService, private router: Router) {
  }
  cargarGrupos(files) {
    const file = files.item(0);

    this.gruposService.cargarGrupos(file);

  }

  saveGrupos() {
    this.gruposService.saveGrupos();
  }

  getAhora() {
    const ahora = new Date("2022/07/01 1:34");
    let diaCorregido = new Date(ahora);
    if (diaCorregido.getHours() < 8) {
      diaCorregido.setTime(ahora.getTime() - 24 * 60 * 60 * 1000);
    }

    this.gruposService.getHorario().then(horario => {
      let url = '';

      const dia = horario.findIndex(d => DateUtils.equals(d.dia, diaCorregido));
      if (dia != -1) {
        url = '/tabs/' + dia;
        const hora: Date = Horario.findHora(ahora, horario[dia]);
        console.log(hora);
        if (!!hora) {
          url = url.concat('/' + hora.getTime());
        }
      }
      this.router.navigateByUrl(url);

    });



  }

  ngOnInit() {
    this.appPages = [
      { title: 'Busqueda', url: '', icon: 'search' },
      { title: 'Horario', url: '/tabs', icon: 'calendar' }
    ];
  }

}
