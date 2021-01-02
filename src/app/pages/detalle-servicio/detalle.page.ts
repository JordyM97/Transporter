import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
import { PopoverController, } from '@ionic/angular';
import { PopoverInicioFinComponent }from 'src/app/components/popover-inicio-fin/popover-inicio-fin.component';
import { PopoverFinComponent }from 'src/app/components/popover-fin/popover-fin.component';
//Servicio para compartir data
import { ShareDataService } from 'src/app/services/share-data.service';
import{ DetalleServicioService } from 'src/app/services/detalle-servicio.service';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';

//Para usar llamadas nativas
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ChatScreenComponent } from 'src/app/components/chat-screen/chat-screen.component';
import { ChatService } from 'src/app/services/chat.service';

declare var google;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})


export class DetallePage implements OnInit,OnDestroy {
  mapa=null;
  marker=null;
  watch:any;

  //Numero del Cliente, debe llegar en la notificacion
  numberClient:string = "0989878654";

  
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  origin = { lat: -2.148250, lng: -79.965125 };

  destination = { lat: -2.148250, lng: -79.965180 };

  nombreNot: string ="";
  nombreNotSubs: Subscription;


  notObj: object={};
  notObjSub: Subscription;

  constructor(
    private geolocation: Geolocation,
    public alertController: AlertController,
    public shareData: ShareDataService,
    private router: Router,
    private detalle:DetalleServicioService,
    public popoverController: PopoverController,
    private callNumber: CallNumber,
    private chatService: ChatService
    ) {
  }
  ngOnDestroy(){
    console.log("*** DESTROY DETALLESS")
  }
  /*ionViewWillLeave(){
    this.watchPosition();
  }*/

  ionViewWillEnter(){
    this.loadMap();
    this.watchPosition();
  }


  ngOnInit(){
  //  this.loadMap();
    //this.watchPosition();
    //window.location.reload()
  } 

  callByCellphone(){
    return this.callNumber.callNumber(this.numberClient, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.error('Error launching dialer', err));
  }

  chatWithClient(){
    return this.callNumber.callNumber(this.numberClient, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.error('Error launching dialer', err));
  }

    //Funcion para cargar el mapa y dibujar la mejor ruta
  async loadMap() {

    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('mapa');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');

    // create map
    this.mapa = await new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 17,
      zoomControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
    });
    await this.directionsDisplay.setMap(this.mapa);
    await google.maps.event.addListenerOnce(this.mapa, 'idle', () => {
      this.origin=this.shareData.notificacion.data.inicio;
      this.destination=this.shareData.notificacion.data.fin;
      mapEle.classList.add('show-map');
      this.calculateRoute(this.origin,this.destination);
    });    
  }

    //Realiza el calculo de la mejor ruta, utiliza los valores de origen y destino| se le debe pasar el modo
    //de viaje que se realiza en este caso DRIVING
  private calculateRoute(ini:any,fin:any){  
    this.directionsService.route({
      origin: JSON.parse(ini) ,
      destination: JSON.parse(fin),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('No se pudo cargar el mapa ' + status);
      }
    });
  }
  
  private watchPosition(){
    this.watch= this.geolocation.watchPosition();
    this.watch.subscribe((data)=>{
      if(this.marker!=null){
        this.marker.setMap(null);
        console.log("entro");
      }
      if ("coords" in data){
        let lat=data.coords.latitude;
        let lng=data.coords.longitude;
        console.log("latitud "+ lat);
        console.log("longitud "+ lng);
        let latLng=new google.maps.LatLng(lat,lng);
        this.chatService.addPosition("1",JSON.stringify(latLng))
        this.marker = new google.maps.Marker({
          map: this.mapa,
          icon: new google.maps.MarkerImage('https://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
          new google.maps.Size(22, 22),
          new google.maps.Point(0, 18),
          new google.maps.Point(11, 11)),
          position: latLng      
        });
      }
      else {
        console.log("ERROR WATCH POSITION");
      }
    })
  } 
  async confirmarServicio() {
    const alert = await this.alertController.create({
      cssClass: 'notification-class',
      header: `Inicio del servicio`,
      message: `<div>
     <img class="center" src="assets/icon/proceso_exitoso.png">
     <p>¿Desea iniciar el servicio?</p>
    </div>`,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('CONFIRM ACEPTAR');
          this.bloquearInicio();
        }
      }, {
        text: 'Cancelar',
        role:'cancel'
      }]
    });

    await alert.present();
  }

  async finalizarServicio() {
    const alert = await this.alertController.create({

      cssClass: 'notification-class',
      header: `Fin del servicio`,
      message: `<div>
     <img class="center" src="assets/icon/proceso_exitoso.png">

     <p>¿Desea finalizar el servicio?</p>
    </div>`,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log('CARRERA FINALIZADA');
          this.stopWatch();
          //this.detalle.geocodeLatLng();
          this.bloquearFin();
          this.router.navigateByUrl('/pago');
        }
      }, {
        text: 'Cancelar',
        role:'cancel'
      }]
    });

    await alert.present();
  }

  private bloquearInicio(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = true;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = false;
  }

  private bloquearFin(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = false;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = true;
  }

  private stopWatch(){
    this.watch=null;
  }

  async presentPopoverInicio() {
    const popover = await this.popoverController.create({
      component: PopoverInicioFinComponent,
      cssClass: 'notification-class',
      componentProps:{
         title:"INICIO DEL SERVICIO",
         body:"Ha llegado a la ubicación del cliente",
         btn:" Iniciar Servicio" 
      },
      mode:"md",
      translucent: true
    });
    return await popover.present();
  }

  async presentPopoverFin() {
    const popover = await this.popoverController.create({
      component: PopoverFinComponent,
      cssClass: 'notification-class',
      componentProps:{
         title:"FIN DEL SERVICIO",
         body:"Ha llegado al final de la ruta",
         btn:" Finalizar Servicio" 
      },
      mode:"md",
      translucent: true
    });
    return await popover.present();
  }
  
  

}