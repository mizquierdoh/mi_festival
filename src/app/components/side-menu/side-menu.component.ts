import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GruposService } from 'src/app/services/grupos.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  constructor(private menu: MenuController,
    private gruposService: GruposService) { }
  ngOnInit(): void {
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  fileChanged(event) {
    this.gruposService.cargarGrupos(event.target.files[0]);
  }

}
