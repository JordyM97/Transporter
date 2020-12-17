import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServicesDriverService {

  idUser: any;
  idDriver: any;
  idVehicle: any;

  nameDriver: any;
  lastNameDriver: any;
  brandVehicle: any;
  colorVehicle: any;
  modelVehicle: any;
  typeVehicle: any;
  historial: Array<any>;


  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore
  ) { 
    this.historial = [];
  }

  getUserInfo(id: any, token: any){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'token '+String(token));
      console.log(token);
      console.log(headers);
  
      this.http.get('https://axela.pythonanywhere.com/api/user/'+String(id)+'/', {headers: headers}) //http://127.0.0.1:8000
        .subscribe(res => {
          let data = JSON.parse(JSON.stringify(res));
          this.idUser = data.id;
          this.nameDriver = data.first_name;
          this.lastNameDriver = data.last_name;
          this.getDriverPk(this.idUser,token);
          console.log(data);
          resolve("ok");
          }, (err) => {
          console.log(err);
          resolve("bad");
        });  });
  }

  getDriverPk(id: any, token: any){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'token '+String(token));
      console.log(token);
      console.log(headers);
  
      this.http.get('https://axela.pythonanywhere.com/api/getpk/'+String(id)+'/0/', {headers: headers}) //http://127.0.0.1:8000
        .subscribe(res => {
          let data = JSON.parse(JSON.stringify(res));
          this.idDriver = data.pk;
          this.getDriverInfo(this.idDriver,token);
          console.log(data);
          resolve("ok");
          }, (err) => {
          console.log(err);
          resolve("bad");
        });  });
  }

  getDriverInfo(id: any, token: any){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'token '+String(token));
      console.log(token);
      console.log(headers);
  
      this.http.get('https://axela.pythonanywhere.com/api/driver/'+String(id)+'/', {headers: headers}) //http://127.0.0.1:8000
        .subscribe(res => {
          let data = JSON.parse(JSON.stringify(res));
          this.idVehicle = data.vehicleDriver;
          this.getVehicleInfo(this.idVehicle,token);
          console.log(data);
          resolve("ok");
          }, (err) => {
          console.log(err);
          resolve("bad");
        });  });
  }

  getVehicleInfo(id: any, token: any){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'token '+String(token));
      console.log(token);
      console.log(headers);
  
      this.http.get('https://axela.pythonanywhere.com/api/vehicle/'+String(id)+'/', {headers: headers}) //http://127.0.0.1:8000
        .subscribe(res => {
          let data = JSON.parse(JSON.stringify(res));
          this.brandVehicle = data.brandVehicle;
          this.colorVehicle = data.colorVehicle;
          this.modelVehicle = data.modelVehicle;
          this.typeVehicle = data.typeVehicle;
          console.log(data);
          resolve("ok");
          }, (err) => {
          console.log(err);
          resolve("bad");
        });  });
  }

  getRecordClient(id: any, token: any){
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers = headers.set('content-type','application/json').set('Authorization', 'token '+String(token));
  
      this.http.get('https://axela.pythonanywhere.com/api/recordService/'+String(id)+'/1/', {headers: headers}) //http://127.0.0.1:8000
        .subscribe(res => {
          let data = JSON.parse(JSON.stringify(res));
          data.forEach(element => {
            //console.log(element) //Recorrer los elementos del array y extraer la info
            this.historial.push(element);
          });
          resolve("ok");
          }, (err) => {
          console.log(err);
          //resolve("ok");
          resolve("bad");
        });  });
  }
  getRecordC(){
    return this.historial;
  }

  getId(){
    return this.idUser;
  }

  getName(){
    return this.nameDriver;
  }

  getLastName(){
    return this.lastNameDriver;
  }

  getBrand(){
    return this.brandVehicle;
  }
  getColor(){
    return this.colorVehicle;
  }
  getModel(){
    return this.modelVehicle;
  }
  getType(){
    return this.typeVehicle;
  }

}
