import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, ToastController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-popover-mapa',
  templateUrl: './popover-mapa.component.html',
  styleUrls: ['./popover-mapa.component.scss'],
})
export class PopoverMapaComponent implements OnInit {

  locations: any;
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();


  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.locations= this.navParams.get('locations');
    console.log(this.locations);
    this.loadMap();
  }

  async loadMap(){
    console.log("SSD")
    console.log(google)
    //Crear nuevo mapa
    const mapEle: HTMLElement = document.getElementById('mapaPruebas');
    console.log(mapEle)
    // Crear el mapa y renderizarlo para ver
    this.map = new google.maps.Map(mapEle, {
      center: JSON.parse(this.locations.inicio),
      zoom: 15,
      zoomControl:false,
      mapTypeControl:false,
      streetViewControl:false,
      fullscreenControl:false
    });
    this.directionsDisplay.setMap(this.map);
    this.calcularRuta();
  }

  calcularRuta(){
    this.directionsService.route({
      origin: JSON.parse(this.locations.inicio),
      destination: JSON.parse(this.locations.fin),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  async DismissClick() {
    await this.popoverController.dismiss();
    const toast = await this.toastController.create({
      message: '¿Vas cambiar algo?',
      duration: 2500,
      position: 'top',
      color: 'danger'
      });
    toast.present();
  }
}
