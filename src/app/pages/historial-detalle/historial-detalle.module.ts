import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialDetallePageRoutingModule } from './historial-detalle-routing.module';

import { HistorialDetallePage } from './historial-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialDetallePageRoutingModule
  ],
  declarations: [HistorialDetallePage]
})
export class HistorialDetallePageModule {}
