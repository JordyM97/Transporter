import { Component, OnInit } from '@angular/core';
export interface notification{
  titulo:string;
  cuerpo:string;
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

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


  constructor() {
    this.notificacionesBD.forEach((not:notification) => {
      
      this.notificacionesShow.push(not);
      
      this.notificacionesShow.push(not);
    
  });
   }


  ngOnInit() {
  }

}
