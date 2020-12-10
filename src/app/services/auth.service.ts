import { Injectable } from '@angular/core';

//Modulo de firebase(authentication) y router(secuencia).
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

import { ToastController } from '@ionic/angular';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public token: any;
  public id:any;
  public nombre: any;
  public apellido: any;
  public correo: any;
  public deviceToken:any;
  public historial : Array<any>;
  public userApp: User;
  public currentUser:any;

  constructor(
    private AFauth: AngularFireAuth,
    private router: Router,
    public toastController: ToastController,
    public http: HttpClient
  ) {
    this.getCurrentUser();
   }

   sendDeviceToken(){
    console.log(this.token);
    console.log(this.deviceToken);
    let req={
      user: this.id,
      registration_id: this.deviceToken,
      type: "android"
    }
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      
      headers = headers.set('content-type','application/json').set('Authorization', 'token '+String(this.token));
    
      this.http.post('https://axela.pythonanywhere.com/api/devices', req, {headers: headers}) //http://127.0.0.1:8000
        .subscribe(res => {
          let data = JSON.parse(JSON.stringify(res));
          data.forEach(element => {
            console.log(element) //Recorrer los elementos del array y extraer la info
          });
          console.log(data);
          resolve("ok");
          }, (err) => {
          console.log(err);
          //resolve("ok");
          resolve("bad");
        });  });
    
  }

  /**
   * Login de respuesta asincrona que en caso de ser exitosa 
   * devuelve un token (auth) con la informacion de la sesion.
   * @correo_electronico
   * @contrasenia
   * @returns una promesa con estados resolve (exito) y reject (fallida).
   */
  login(credentials){
    console.log(credentials);
    console.log(JSON.stringify(credentials));
    
    return new Promise((resolve, reject) => {
        let headers = new HttpHeaders();
       
      //headers = headers.set('Access-Control-Allow-Origin' , '*');
       //headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
       //headers.append('Accept','application/json');
       //headers.append('content-type','application/json');
 
        this.http.post('https://axela.pythonanywhere.com/api/rest-auth/', credentials, {headers: headers}) //http://127.0.0.1:8000
          .subscribe(res => {
            let data = JSON.parse(JSON.stringify(res));
            this.id=data.id;
            this.token = data.token;
            this.nombre = data.first_name;
            this.apellido = data.last_name;
            this.correo = data.email;
            console.log(data);
            resolve("ok");
            }, (err) => {
            console.log(err);
            //resolve("ok");
            resolve("bad");
          });  });
 
  }


  /**
   * Logout de respuesta asincrona que en caso de ser exitosa 
   * redirecciona a la pantalla de login, sino lanza un error.
   * @returns una promesa 
   */
  logout() {
    return this.AFauth.signOut()
      .then(() => {
        this.router.navigate(['/login'])
        console.log('Redirigir')
      }
      ).catch(
        err => {
          console.error('ERROR> En la auth. Linea 42 in auth.service.ts' + err)

        }
      )
  }

  /**
   * Usa el obj AFauth para enviar un correo de recuperacion de contraseña al proveedor que lo solicita.
   * Nota: Se puede personalizar el mensaje enviado desde firebase/console/authentication
   * Pdt: Para probar se recomienda usar un email temporal, debidamente registrado como usuario.
   * @param correo_recuperacion (del proveedor) destino donde se enviara el mensaje
   */
  reset_password(correo_recuperacion: string) {
    if (isNullOrUndefined(correo_recuperacion) || correo_recuperacion == "") {
      this.presentToastFeedback('Debe ingresar un correo electronico.')
      //alert("Debe ingresar un correo electronico.")
    } else {
      this.AFauth.sendPasswordResetEmail(correo_recuperacion)
        .then(
          (res) => {
            console.log("Exito!!! se envio")
            this.presentToastFeedback('Exito!!! se envio al correo de recuperacion');
            this.router.navigate(['/login'])
          }
        ).catch(
          (err) => {
            this.presentToastFeedback("ERROR> Linea 66 auth.service " + err);
            console.error("ERROR> Linea 66 auth.service " + err)
          }
        )
    }
  }

  async presentToastFeedback(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  getCurrentUser(){
    this.AFauth.onAuthStateChanged(
      user => {
        console.log('Change: ',user);
        this.currentUser = user;
      }
    );
    return this.currentUser;
  }
}
