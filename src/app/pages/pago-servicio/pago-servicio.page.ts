import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-servicio',
  templateUrl: './pago-servicio.page.html',
  styleUrls: ['./pago-servicio.page.scss'],
})
export class PagoServicioPage implements OnInit {

  constructor(
    private router: Router,

  ) { }

  ngOnInit() {
  }

  finalizarServicio(){
    this.router.navigateByUrl('/map');
  }

}
