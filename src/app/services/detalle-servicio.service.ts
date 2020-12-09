import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DetalleServicio } from './../interfaces/detalle-servicio';
import { google } from "google-maps";
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


declare var google:google;


@Injectable({
  providedIn: 'root'
})
export class DetalleServicioService {
  private urlServidor = 'https://jsonplaceholder.typicode.com';
  geocoder= new google.maps.Geocoder();
  direccion:String;

  constructor(
    private http:HttpClient,
    public alertController: AlertController,
    private router: Router

  ) { }
  
  
  getTask(id: string) {
    const path = `${this.urlServidor}/users/${id}`;
    return this.http.get<DetalleServicio>(path);
  }

  updateTask(servicio: DetalleServicio) {
    const path = `${this.urlServidor}/users/${servicio.id}`;
    return this.http.put<DetalleServicio>(path, servicio);
  }

  geocodeLatLng(data:any){
    return new Promise((resolve,rejects)=>{
      let str = JSON.parse(data);
      const latlng=str;
      console.log("data que recibe geocodeLat"+data);
      console.log("data myString"+str);
      console.log("constante latlng"+latlng);
      this.geocoder.geocode(
        {location:latlng},
        (results:google.maps.GeocoderResult[],
        status:google.maps.GeocoderStatus
          )=>{
            if(status==="OK"){
              if(results[0]){
                console.log(results[0].formatted_address);
                console.log("esta vaina entro al ok"+results[0].formatted_address);
                resolve(
                  results[0].formatted_address
                )
              }
              else{
                console.log("No results found");
              }
            }
            else{
              console.log("Geocoder failed due to: " + status);
              rejects(status);
            }
          }
      );
    });
  }
}