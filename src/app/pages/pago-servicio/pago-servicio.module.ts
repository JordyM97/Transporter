import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagoServicioPageRoutingModule } from './pago-servicio-routing.module';

import { PagoServicioPage } from './pago-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagoServicioPageRoutingModule
  ],
  declarations: [PagoServicioPage]
})
export class PagoServicioPageModule {}
