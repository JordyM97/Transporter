import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoServicioPage } from './pago-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: PagoServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagoServicioPageRoutingModule {}
