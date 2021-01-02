import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

//Para las push notifications
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor

} from '@capacitor/core';

const { PushNotifications } = Plugins;

//Compartir la data a traves de un service
import { ShareDataService } from './share-data.service';
import { PopoverDetalleComponent } from '../components/popover-detalle/popover-detalle.component';
import { DetalleServicioService } from './detalle-servicio.service';
import { PopoverController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { not } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  as:any;
  a:any;
  constructor(
    private router: Router,
    private shareData: ShareDataService,
    private detalle:DetalleServicioService,
    private popoverController: PopoverController,
    private authService:AuthService
  ) {

  }

  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }


  
  private registerPush() {
    /*
    * Solicitar permiso para usar notificaciones push
    * iOS solicitará al usuario y regresará si les concedió permiso o no
    * Android sólo concederá sin preguntar
    */
    PushNotifications.requestPermission().then(permission => {
      if (permission.granted) {
        //  Regístrese en Apple / Google para recibir push a través de APNS/FCM
        PushNotifications.register();
      } else {
        // Manejo de errores
        console.error("ERROR> Linea 42 home.page.ts")
      }
    });

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        //alert('Push registration success, token: ' + token.value);
        console.log('My token: ' + JSON.stringify(token))
        //Enviar post con el token
        this.a= token.value.toString();
        this.as={
          token : this.a
        }
        this.authService.deviceToken=this.as;
        //alert('Push registration success, token: ' + token.value);
        //console.log(token)
        this.authService.postDataAPI(this.as);
        
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
    async (notification:  PushNotification) => {
        let origin=JSON.parse(notification.data.inicio);
        console.log(notification.data.pk);
        console.log('Inicio> ',typeof(origin))//object
        console.log('Inicio> ',typeof(origin.lat))
        let destiny=JSON.parse(notification.data.fin);
        console.log('Fin> ',typeof(destiny.lng))

        let notObjeto = {
          'title':notification.title,
          'inicio':origin,
          'fin':destiny,
          'hora':notification.data.hora,
          'fecha':notification.data.fecha,
          'metodoPago':notification.data.metodoPago,
          'valor':notification.data.valor,
          'cliente':notification.data.cliente,
          'idCliente':notification.data.idCliente,
        }

        this.shareData.nombreNot$.emit(JSON.stringify(notification));

        this.shareData.notObj$.emit(notObjeto);

        this.shareData.notificacion = notification;
        this.shareData.detalleServicio=notification;
        //this.presentAlertConfirm(notification);
        this.shareData.inicio=await this.detalle.geocodeLatLng(notification.data.inicio);
        this.shareData.fin=await this.detalle.geocodeLatLng(notification.data.fin);


        this.presentPopoverDetalle(notification);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
        
        if (notification.notification.data) {
          console.log('ActionPerformed, notification: '+ JSON.stringify(notification.notification))
          console.log('ActionPerformed, data: '+ JSON.stringify(notification.notification.data))
          let isCompleteRouter = await this.router.navigateByUrl(`/tabs/${notification.notification.data}`)
          if(isCompleteRouter){
            console.log('LLEGO A LA TABS')
             let origin=JSON.parse(notification.notification.data.inicio);
             console.log('Inicio> ',typeof(origin))//object
             console.log('Inicio> ',typeof(origin.lat))
             let destiny=JSON.parse(notification.notification.data.fin);
             console.log('Fin> ',typeof(destiny.lng))
             let notObjeto = {
              'title':notification.notification.title,
              'inicio':origin,
              'fin':destiny,
              'hora':notification.notification.data.hora,
              'fecha':notification.notification.data.fecha,
              'metodoPago':notification.notification.data.metodoPago,
              'valor':notification.notification.data.valor,
              'cliente':notification.notification.data.cliente,
              'idCliente':notification.notification.data.idCliente,
            }
           
  
            this.shareData.nombreNot$.emit(JSON.stringify(notification.notification));

            this.shareData.notObj$.emit(notObjeto);
    
            this.shareData.notificacion = notification.notification;
            this.shareData.detalleServicio=notification.notification;
            //this.presentAlertConfirm(notification);
            this.shareData.inicio=await this.detalle.geocodeLatLng(notification.notification.data.inicio);
            this.shareData.fin=await this.detalle.geocodeLatLng(notification.notification.data.fin);
          this.presentPopoverDetalle(notification.notification);
          }
          
        }
        else{
            console.log("no data in noti")
        }
      }
    );

  }

  async presentPopoverDetalle(notification) {
    let title = notification.title;
    let strInicio = await this.detalle.geocodeLatLng(notification.data.inicio);
    let strFin = await this.detalle.geocodeLatLng(notification.data.fin);
    let hora = notification.data.hora;
    let fecha = notification.data.fecha;
    let metodoPago = notification.data.metodoPago;
    let valor = notification.data.valor;
    let cliente = notification.data.cliente;
    let inicioCoords = notification.data.inicio;
    let finCoords = notification.data.fin;
    let idCliente = notification.data.idCliente;
    //let idCliente = notification.data.idCliente;

    const popover = await this.popoverController.create({
      component: PopoverDetalleComponent,
      cssClass: 'my-custom-class',
      componentProps:{
         title: title,
         inicio: strInicio,
         fin: strFin,
         fecha: fecha,
         hora: hora,
         metodoPago: metodoPago,
         valor: valor,
         cliente: cliente,
         inicioCoords: inicioCoords,
         finCoords: finCoords,
         idCliente: idCliente
      },
      mode:"md",
      translucent: true
    });
    return await popover.present();
  }


}
