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

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private router: Router,
    private shareData: ShareDataService,
    private detalle:DetalleServicioService,
    private popoverController: PopoverController,
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
        console.log('Inicio> ',typeof(origin))//object
        console.log('Inicio> ',typeof(origin.lat))
        let destiny=JSON.parse(notification.data.fin);
        console.log('Fin> ',typeof(destiny.lng))

        let notObjeto = {
          'title':notification.title,
          'inicio':origin,
          'fin':destiny,
          'hora':notification.data.hora,
          'metodoPago':notification.data.metodoPago,
          'valor':notification.data.valor,
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
          //   let origin=JSON.parse(notification.notification.data.inicio);
          //   console.log('Inicio> ',typeof(origin))//object
          //   console.log('Inicio> ',typeof(origin.lat))
          //   let destiny=JSON.parse(notification.notification.data.fin);
          //   console.log('Fin> ',typeof(destiny.lng))
  
          // let notObjeto = {
          //   'title':notification.notification.title,
          //   'inicio':origin,
          //   'fin':destiny,
          //   'hora':notification.notification.data.hora,
          //   'metodoPago':notification.notification.data.metodoPago,
          //   'valor':notification.notification.data.valor,
          // }
  
         
          // this.shareData.notificacion=notification;
          // this.shareData.detalleServicio=notification;
          // this.presentPopoverDetalle(notification);
          }
          
        }
      }
    );

  }

  async presentPopoverDetalle(notification) {
    let title=notification.title;
    let strInicio= await this.detalle.geocodeLatLng(notification.data.inicio);
    let strFin= await this.detalle.geocodeLatLng(notification.data.fin);
    let hora=notification.data.hora;
    let metodoPago=notification.data.metodoPago;
    let valor=notification.data.valor;

    const popover = await this.popoverController.create({
      component: PopoverDetalleComponent,
      cssClass: 'my-custom-class',
      componentProps:{
         title:title,
         inicio:strInicio,
         fin:strFin,
         hora:hora,
         metodoPago:metodoPago,
         valor:valor
      },
      mode:"md",
      translucent: true
    });
    return await popover.present();
  }


}
