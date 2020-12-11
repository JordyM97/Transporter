import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

//Servicio para la authentication con firebase y el ruteo entre apaginas
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router'

//Importar el Ctrl de Toast (Feedback)
import { ToastController } from '@ionic/angular';
//Importar el Loading (Feedback)
import { LoaderService } from 'src/app/services/loader.service';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo_electronico: string
  contrasenia: string

/*
  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;
  // Seleccionamos el elemento co   n el nombre que le pusimos con el #
  passwordTypeInput  =  'password';   */


  showPassword=false;
  passwordIcon='eye';

  constructor(
    private authService: AuthService, 
    public router:Router,
    public toastController: ToastController,
    private ionLoader: LoaderService,
    private appcom:AppComponent,
  ) { }

  ngOnInit() {
  }



  on_submit_login(){
    let credentials= {
      username: this.correo_electronico,
      password: this.contrasenia
    };
    localStorage.setItem("correo",credentials.username);
    localStorage.setItem("password",credentials.password);
    this.authService.login(credentials).then( (result)=>{
      console.log(result)
      console.log(this.authService.token);
      if(result=="ok"){
        if(this.authService.deviceToken!= null){
          this.authService.sendDeviceToken();
        }
        this.appcom.username=this.authService.nombre;
        
        this.router.navigate(['tabs'])
      }
      else{
        this.presentToastFeedback()
      }
    })
  }

  
  async presentToastFeedback() {
    const toast = await this.toastController.create({
      message: 'Usuario/contraseña incorrectos',
      position: 'top',
      duration: 2000
    });
    toast.present();
    this.ionLoader.hideLoader();
  }

  async presentToastFeedbackWithOptions(err) {
    const toast = await this.toastController.create({
      header: 'Usuario/contraseña incorrectos',
      message: err,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  // Esta función verifica si el tipo de campo es texto lo cambia a password y viceversa, además verificara el icono si es 'eye-off' lo cambiara a 'eye' y viceversa
/*togglePasswordMode() {
  //cambiar tipo input
this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
 //obtener el input
 const nativeEl = this.passwordEye.nativeElement.querySelector('input');
 //obtener el indice de la posición del texto actual en el input
 const inputSelection = nativeEl.selectionStart;
 //ejecuto el focus al input
 nativeEl.focus();
//espero un milisegundo y actualizo la posición del indice del texto
 setTimeout(() => {
     nativeEl.setSelectionRange(inputSelection, inputSelection);
 }, 1);

}*/

  iconPassword(){
    this.showPassword=!this.showPassword;
    if(this.passwordIcon=='eye'){
      this.passwordIcon='eye-off';
    }
    else{
      this.passwordIcon='eye';
    }
  }

}
