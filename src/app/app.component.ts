import { Component, OnInit } from '@angular/core';
import { AuthService } from "./services/auth.service";
import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import{DetalleServicioService} from 'src/app/services/detalle-servicio.service';

import { PopoverController} from '@ionic/angular';


//Para las push notifications
import { FcmService } from './services/fcm.service';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
 
} from '@capacitor/core';

const { PushNotifications } = Plugins;

import { Router } from '@angular/router';

//Alertas de manera local
import { AlertController } from '@ionic/angular';
//Compartir la data a traves de un service
import { ShareDataService } from './services/share-data.service';
import { PopoverDetalleComponent } from './components/popover-detalle/popover-detalle.component';
import { HttpService } from './services/http.service';
import { Observable } from 'rxjs';

import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';

// import { IonRouterOutlet } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
   geocoder = new google.maps.Geocoder();
   politicas: Observable<any>;
   username= "Invitado";
  constructor(
    private AFauth: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alertController: AlertController,
    private shareData: ShareDataService,
    private router: Router,
    private detalle:DetalleServicioService,
    private popoverController: PopoverController,
    private fcmService: FcmService,
    private httpService: HttpService,
    private modalCtrl:ModalController,
    private authservice: AuthService,
    // private routerOutlet: IonRouterOutlet,
    //private navParams: NavParams,

  ) {
    this.initializeApp();
  }
   
  ngOnInit() {}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //Initializar las PushNotifications
      this.fcmService.initPush();
      this.router.navigateByUrl("login")
    });
  }
  reload(){
    this.reload();
  }
  async presentAlert(identificacion: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Registro de Notificaciones',
      subHeader: 'Listo para recibir Peticiones de Servicios!!!',
      message: 'ID> '+identificacion,
      buttons: ['OK']
    });

    await alert.present();
  }

  on_logout(){
    this.AFauth.logout();
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

  getPoliticas(){
    console.log("POLITICAS:")
    this.politicas=(this.httpService.getPoliticas());
    this.politicas.subscribe(
      res => {
        console.log(res);
        this.presentModal(res);
      }
    );
  }

  async presentModal(res) {
    const modal = await this.modalCtrl.create({
      component: TerminosCondicionesComponent,
      componentProps: {
        'politicas': res,
      },
      swipeToClose: true,
      // presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }
}
