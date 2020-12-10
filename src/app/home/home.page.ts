import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { AuthService } from "../services/auth.service";

export interface notification{
  titulo:string;
  cuerpo:string;
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  notificacionesShow=[];
  //reemplazar por mensajes de la BD
  notificacionesBD:notification []=[
    {
      titulo:"Prueba1",
      cuerpo:"Cuerpo de la notificación"
    },  
    {
      titulo:"Prueba2",
      cuerpo:"Cuerpo de la notificación"
    },
    {
      titulo:"Prueba3",
      cuerpo:"Cuerpo de la notificación"
    },
    {
      titulo:"Prueba4",
      cuerpo:"Cuerpo de la notificación"
    },
    {
      titulo:"Prueba5",
      cuerpo:"Cuerpo de la notificación"
    }
  ];

  
  
  constructor(
    private AFauth: AuthService,
    public platform: Platform,
    public router: Router,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigateByUrl('Home')
    });

  }
  
  ngOnInit(){
    this.notificacionesBD.forEach((not:notification) => {
      
        this.notificacionesShow.push(not);
        
        this.notificacionesShow.push(not);
      
    });
  }

  on_logout(){
    this.AFauth.logout();
  }


}
