import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {  Router } from '@angular/router'
import { ServicesDriverService } from 'src/app/services/services-driver.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  
  historialViajes: Array<any>;
  historialFinal: Array<any>;
  detallesViaje: Array<any>;
  estadoViaje: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private DriverService: ServicesDriverService
  ){
    this.historialFinal = []
  }

  ngOnInit() {
    this.historialViajes = this.DriverService.getRecordD();
    console.log(this.historialViajes);
    this.historialViajes.slice().reverse().forEach(element => {
      if (element.startidLocation!=null) {
        this.historialFinal.push(element);
      }
    });
  }

  botonDetalles(element: any){
    this.detallesViaje = element;
    this.router.navigate(['historial-detalle/'+JSON.stringify(this.detallesViaje)])
  }

  public getDetallesViaje(){
    return this.detallesViaje;
  }

  getColor(estado) {
    switch (estado) {
      case 1:
        return 'red';
      case 0:
        return 'green';
    }
  }
}
