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
import { ServicesDriverService } from './services-driver.service';

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
    private authService:AuthService,
    private DriverService: ServicesDriverService
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
        //this.authService.postDataAPI(this.as);
        
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
    async (notification:  PushNotification) => {
        let origin=JSON.parse(notification.data.coordStart);
        console.log(notification.data.pk);
        console.log('Inicio> ',typeof(origin))//object
        console.log('Inicio> ',typeof(origin.lat))
        let destiny=JSON.parse(notification.data.coordEnd);
        console.log('Fin> ',typeof(destiny.lng))
        await this.authService.getUserId(notification.data.idClientService);
        await this.DriverService.getClientInfo(this.authService.idCliente,this.authService.getToken());
        console.log(this.DriverService.getNameClient()+" "+this.DriverService.getLastNameClient());
        let date = new Date(notification.data.startDate);
        let anio = date.getFullYear(); 
        let mes = String(date.getMonth() + 1).padStart(2, '0');
        let dia = String(date.getDate()).padStart(2, '0');
        let hora = String(date.getHours());
        let minuto =String(date.getMinutes());

        let notObjeto = {
          'title':notification.title,
          'inicio':notification.data.coordStart,
          'fin':notification.data.coordEnd,
          'hora': hora+':'+minuto,
          'fecha': dia+'/'+mes+'/'+anio,
          'metodoPago':notification.data.idTypePayment,
          'valor':notification.data.amountPayment,
          'cliente':this.DriverService.getNameClient()+" "+this.DriverService.getLastNameClient(),
          'idCliente':notification.data.idClientService,
          'pkServicio':notification.data.pk
        }

        this.shareData.nombreNot$.emit(JSON.stringify(notification));

        this.shareData.notObj$.emit(notObjeto);

        this.shareData.notificacion = notification;
        this.shareData.detalleServicio=notObjeto;
        //this.presentAlertConfirm(notification);
        this.shareData.inicio=await this.detalle.geocodeLatLng(notification.data.coordStart);
        this.shareData.fin=await this.detalle.geocodeLatLng(notification.data.coordEnd);


        this.presentPopoverDetalle(notObjeto);
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        //alert('Push action performed: ' + JSON.stringify(notification));
        
        if (notification.notification.data) {
          console.log('ActionPerformed, notification: '+ JSON.stringify(notification.notification))
          console.log('ActionPerformed, data: '+ JSON.stringify(notification.notification.data))
          let isCompleteRouter = await this.router.navigateByUrl(`/tabs/${notification.notification.data}`)
          this.DriverService.getClientInfo(notification.notification.data.idClientService,localStorage.getItem("token"));
          if(isCompleteRouter){
            console.log('LLEGO A LA TABS')
             let origin=JSON.parse(notification.notification.data.coordStart);
             console.log('Inicio> ',typeof(origin))//object
             console.log('Inicio> ',typeof(origin.lat))
             let destiny=JSON.parse(notification.notification.data.coordEnd);
             console.log('Fin> ',typeof(destiny.lng))
             let date = new Date(notification.notification.data.startDate);
            let anio = date.getFullYear(); 
            let mes = String(date.getMonth() + 1).padStart(2, '0');
            let dia = String(date.getDate()).padStart(2, '0');
            let hora = String(date.getHours());
            let minuto =String(date.getMinutes());
             let notObjeto = {
              'title':notification.notification.title,
              'inicio':notification.notification.data.coordStart,
              'fin':notification.notification.data.coordEnd,
              'hora': hora+':'+minuto,
              'fecha': dia+'/'+mes+'/'+anio,
              'metodoPago':notification.notification.data.idTypePayment,
              'valor':notification.notification.data.amountPayment,
              'cliente':this.DriverService.getNameClient()+" "+this.DriverService.getLastNameClient(),
              'idCliente':notification.notification.data.idClientService,
              'pkServicio':notification.notification.data.pk
            }
            localStorage.setItem('idCliente',notification.notification.data.idClientService);           
            console.log(notObjeto)
            this.shareData.nombreNot$.emit(JSON.stringify(notification.notification));

            this.shareData.notObj$.emit(notObjeto);
    
            this.shareData.notificacion = notification.notification;
            this.shareData.detalleServicio=notObjeto;
            //this.presentAlertConfirm(notification);
            this.shareData.inicio=await this.detalle.geocodeLatLng(notification.notification.data.coordStart);
            this.shareData.fin=await this.detalle.geocodeLatLng(notification.notification.data.coordEnd);
          this.presentPopoverDetalle(notObjeto);
          }
          
        }
        else{
            console.log("no data in noti")
        }
      }
    );

  }

  async presentPopoverDetalle(notification) {
    console.log(notification)
    let title = notification.title;
    let strInicio = await this.detalle.geocodeLatLng(notification.inicio);
    let strFin = await this.detalle.geocodeLatLng(notification.fin);
    let hora = notification.hora;
    let fecha = notification.fecha;
    let metodoPago = notification.metodoPago;
    let valor = notification.valor;
    let cliente = notification.cliente;
    let inicioCoords = notification.inicio;
    let finCoords = notification.fin;
    let idCliente = notification.idCliente;
    let pkServicio = notification.pkServicio;
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
         idCliente: idCliente,
         pkServicio: pkServicio
      },
      mode:"md",
      translucent: true
    });
    return await popover.present();
  }


}
