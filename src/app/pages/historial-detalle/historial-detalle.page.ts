import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historial-detalle',
  templateUrl: './historial-detalle.page.html',
  styleUrls: ['./historial-detalle.page.scss'],
})
export class HistorialDetallePage implements OnInit {

  historialViaje: any;
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  latLngInicial: any;
  anio: any;
  mes: any;
  dia: any;
  hora: any;
  minuto: any;


  constructor(
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {
    this.activateRouter.paramMap.subscribe((data) =>{
        this.historialViaje = data;
      }
    )

  }

  ngOnInit() {
    this.historialViaje = JSON.parse(this.historialViaje.params.datos);
    console.log(this.historialViaje);
    console.log(JSON.parse(this.historialViaje.coordStart))
    let date = new Date(this.historialViaje.startDate);
    this.anio = date.getFullYear(); 
    this.mes = String(date.getMonth() + 1).padStart(2, '0');
    this.dia = String(date.getDate()).padStart(2, '0');
    this.hora = String(date.getHours());
    this.minuto =String(date.getMinutes());
    this.loadMap();
  }

  async loadMap(){
    //Crear nuevo mapa
    const mapEle: HTMLElement = document.getElementById('mapaHistorial');
    // Crear el mapa y renderizarlo
    this.map = new google.maps.Map(mapEle, {
      center: JSON.parse(this.historialViaje.coordStart),
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
      origin: JSON.parse(this.historialViaje.coordStart),
      destination: JSON.parse(this.historialViaje.coordEnd),
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  botonAceptar(){
    this.router.navigate(['historial']);
  }

}
