import { Component } from '@angular/core';
import { GruposService } from '../services/grupos.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  dias: Date[];
  constructor(private gruposService: GruposService) {

  }

  ngOnInit() {
    this.gruposService.getHorario().then(horario => {
      if (!horario) {
        return [];
      }
      this.dias = horario.map(h => h.dia);
    });
  }

}
