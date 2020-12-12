import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
//import { sign } from 'crypto';

@Component({
  selector: 'app-popover-detalle',
  templateUrl: './popover-detalle.component.html',
  styleUrls: ['./popover-detalle.component.scss'],
})
export class PopoverDetalleComponent implements OnInit {
  title;
  inicio;
  fin;
  hora;
  fecha;
  metodo;
  valor;
  cliente;

  constructor(
    private router: Router,
    private navParams: NavParams,
    private popover:PopoverController){
    this.title = this.navParams.get("title");
    this.inicio = this.navParams.get("inicio");
    this.fin = this.navParams.get("fin");
    this.hora = this.navParams.get("hora");
    this.fecha = this.navParams.get("fecha")
    this.metodo = this.navParams.get("metodoPago");
    this.valor = this.navParams.get("valor");
    this.cliente = this.navParams.get("cliente")
   }

  ngOnInit() {}


async btnSi(){
  console.log('Confirm Okay');
  await this.popover.dismiss();
  this.router.navigate(['/detalle']);
}

async btnNo(){
  console.log('Confirm cancel');
  await this.popover.dismiss();
}
  
}
