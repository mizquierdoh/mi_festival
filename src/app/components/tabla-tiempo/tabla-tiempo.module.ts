import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TablaTiempoComponent } from './tabla-tiempo.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule],
    declarations: [TablaTiempoComponent],
    exports: [TablaTiempoComponent]
})
export class TablaTiempoComponentModule { }
