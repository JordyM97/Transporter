import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ServicesDriverService } from 'src/app/services/services-driver.service';
//import {PopoverInicioFinComponent}from 'src/app/components/popover-inicio-fin/popover-inicio-fin.component';

import * as firebase from 'firebase';
import { Router } from '@angular/router';
declare var google;

//Servicio para compartir data

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss']
})


export class MapPage implements OnInit,OnDestroy {
  map = null;
  status=false;
  marker=null;
  watch:any
  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private driverService: ServicesDriverService,
    public PopoverController:PopoverController,
    public firestore: AngularFirestore,
    public platform:Platform,
    public router:Router
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigateByUrl('/tabs/map')
    });
  }
  ngOnDestroy(){
    this.map=null;
  }
  
  ionViewWillEnter(){
   this.loadMap();
   this.driverService.getUserInfo(this.authService.getId(),this.authService.getToken());
   this.driverService.getRecordDriver(this.authService.getId(),this.authService.getToken());
  }
  ngOnInit() {
    this.watchPosition();
    //this.watchPosition();
    //this.loadMap();
  }

  //Cargar el mapa, llama a la funcion getLocation para obtener longitud y latitud del usuario y los pasa 
  //para renderizar el mapa utilizando la variable map(Valores y detalles del mapa)
  async loadMap() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
    const myLatLng = await this.getLocation();
    const mapEle: HTMLElement = document.getElementById('map');
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 17,
      zoomControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
    });
    google.maps.event
    .addListenerOnce(this.map, 'idle', () => {
      loading.dismiss();
      this.addMaker(myLatLng.lat, myLatLng.lng);
    })
  }

  //Agrega un marcador al punto que se le pasa y lo dibuja en el mapa, recibe los paramatros de latitud y longitud
  private addMaker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      icon: 'assets/icon/pointer_proveed.png',
      position: { lat, lng },
      map: this.map,
      title: 'Transporter'
    });
  }


  //Funcion para obtener la localizacion, devuelve dos valores (latitud y longitud)
  private async getLocation() {
    const myPosition = await this.geolocation.getCurrentPosition();
    //console.log("Latitud :"+myPosition.coords.latitude+"Longitud :"+myPosition.coords.longitude);

    return {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude
    };
  }
  private watchPosition(){
    this.watch= this.geolocation.watchPosition();
    this.watch.subscribe((data)=>{
      if(this.marker!=null){
        this.marker.setMap(null);
        //console.log("entro");
      }
      if ("coords" in data){
        let lat=data.coords.latitude;
        let lng=data.coords.longitude;
        //console.log("latitud "+ lat);
        //console.log("longitud "+ lng);
        let latLng=new google.maps.LatLng(lat,lng);
        this.addPosition(this.authService.id,JSON.stringify(latLng))
        this.marker = new google.maps.Marker({
          map: this.map,
          icon: new google.maps.MarkerImage('assets/icon/pointer_proveedor.png',
          new google.maps.Size(22, 22),
          new google.maps.Point(0, 28),
          new google.maps.Point(21, 21)),
          position: latLng      
        });
      }
      else {
        console.log("ERROR WATCH POSITION");
      }
    })
  } 
  addPosition(id:string,location:string){
    var ref=this.firestore.doc(`posicion/${id}`);
    ref.get().subscribe(doc =>{
      if(doc.exists){
        ref.update({
            location: location ,
            id: id,
            from: this.authService.nombre,
            type: 'driver',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
      }else{
        ref.set({ location: location , id:id,
          from: this.authService.nombre,
          createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      }
    })
     
  }
  /*private watchPosition(){
    let watch= this.geolocation.watchPosition();
    watch.subscribe((data)=>{
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
        this.marker = new google.maps.Marker({
          map: this.map,
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
      cssClass: 'my-custom-class',
      header: 'Desea iniciar el servicio?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('CONFIRM ACEPTAR');
            this.bloquearInicio();
          }
        }, {
          text: 'Cancelar',
          role:'cancel'
        }
      ]
    });

    await alert.present();
  }

  private bloquearInicio(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = true;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = false;
  }

  async finalizarServicio() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Desea finalizar el servicio?',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('CARRERA FINALIZADA');
          }
        }, {
          text: 'Cancelar',
          role:'cancel'
        }
      ]
    });

    await alert.present();
  }*/

}