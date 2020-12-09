import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private _API_URI: string = 'https://ctvehicular.pythonanywhere.com/api';

  constructor(
    private http: HttpClient,
  ) {


  }

  //METODO PARA PEDIR AL BACKEND LA POLITICA DE LA EMPRESA
  getPoliticas(){
    const id=2;
    return this.http.get(`${this._API_URI}/police/${id}/`);
  }

  // getPoliticas() {
  //   const id=2;
  //   this.http.get('https://ionic.io', {}, {})
  // .then(data => {

  //   console.log(data.status);
  //   console.log(data.data); // data received by server
  //   console.log(data.headers);

  // })
  // .catch(error => {

  //   console.log(error.status);
  //   console.log(error.error); // error message as string
  //   console.log(error.headers);

  // });
}

  




/*

//METODO PARA PEDIR AL BACKEND LA POLITICA DE LA EMPRESA
  getPolitica(){
    const id=2;
    return this.http.get(`${this.API_URI}/police/${id}/`);
  }

*/