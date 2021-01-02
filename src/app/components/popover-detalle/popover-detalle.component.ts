import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { ServicesDriverService } from 'src/app/services/services-driver.service';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverMapaComponent } from '../popover-mapa/popover-mapa.component';
@Component({
  selector: 'app-popover-detalle',
  templateUrl: './popover-detalle.component.html',
  styleUrls: ['./popover-detalle.component.scss'],
})
export class PopoverDetalleComponent implements OnInit {
  title;
  inicio;
  fin;
  hora;
  fecha;
  metodo;
  valor;
  cliente;
  idCliente;
  inicioCoords;
  finCoords;
  notificacionCareApp;
  viajesCliente;
  idServicio;
  uploadForm: FormGroup;

  constructor(
    private router: Router,
    private navParams: NavParams,
    private popovercontroller:PopoverController,
    private formBuilder: FormBuilder,
    private servicesDriver: ServicesDriverService,
    private authService: AuthService,
    public modalController: ModalController
  ){
    this.viajesCliente = [];
    this.title = this.navParams.get("title")
    this.inicio = this.navParams.get("inicio")
    this.fin = this.navParams.get("fin")
    this.hora = this.navParams.get("hora")
    this.fecha = this.navParams.get("fecha")
    this.metodo = this.navParams.get("metodoPago")
    this.valor = this.navParams.get("valor");
    this.cliente = this.navParams.get("cliente")
    this.idCliente = this.navParams.get("idCliente")
    this.inicioCoords = this.navParams.get("inicioCoords")
    this.finCoords = this.navParams.get("finCoords")
   }

  ngOnInit() {
    this.servicesDriver.getRecordClient(this.idCliente,localStorage.getItem("token"));
    this.uploadForm = this.formBuilder.group({
      service: [''],
      driver: [''],
      client: [''],
      data: ['']
    });
  }
  loguinAutomatico(){
    let credentials= {
      username: localStorage.getItem("correo"),
      password: localStorage.getItem("password")
    };

    this.authService.login(credentials).then( (result)=>{
      console.log(result)
      //console.log(this.authService.token);
      if(result=="ok"){
        if(this.authService.deviceToken!= null){
          this.authService.sendDeviceToken();
        }

      }else{
        
      }
    })
    }
  async btnMapa() {
    var inicio = this.inicioCoords;
    var fin = this.finCoords;
    const modal = await this.modalController.create({
      component: PopoverMapaComponent,
      cssClass: 'mapa-popover',
      componentProps:{
        locations: {
          inicio: inicio,
          fin: fin
        }
      } 
    }); 
    return await modal.present();
  }
/*
  async btnMapa(){
    var inicio = this.inicioCoords;
    var fin = this.finCoords;
    const popoveer= await this.popovercontroller.create({
      component: PopoverMapaComponent,
      translucent: true,
      cssClass: 'fullscreen',
      componentProps:{
        locations: {
          inicio: inicio,
          fin: fin
        }
      } 
    }); 
    return await popoveer.present();
  }*/


  async btnSi(){
    this.loguinAutomatico();
    console.log(this.idCliente);
    console.log(this.authService.getToken());
    this.servicesDriver.getRecordClient(this.idCliente,this.authService.getToken());
    this.uploadForm = this.formBuilder.group({
      service: [''],
      driver: [''],
      client: [''],
      data: ['']
    });
    console.log('Confirm Okay');
    this.viajesCliente = this.servicesDriver.getRecordC();
    console.log(this.viajesCliente)
    this.idServicio = this.viajesCliente.pop().idService /*Conseguimos el ultimo id del servicio*/
    this.notificacionCareApp = {  /*VALOR DE PRUEBA*/
      nombreConductor: this.servicesDriver.getName(),
      apellidoConductor: this.servicesDriver.getLastName(),
      calificacionConductor: '5',
      telefonoConductor: '0999999999',
      modeloVehiculo: this.servicesDriver.getModel(),
      placaVehiculo: this.servicesDriver.getBrand(),
      colorVehiculo: this.servicesDriver.getColor(),
      inicioCoords: this.inicioCoords,
      finCoords: this.finCoords
    }
    this.enviarNotificacion(this.notificacionCareApp);
    this.router.navigate(['/detalle']);
    await this.popovercontroller.dismiss();
  }

  async btnNo(){
    console.log('Confirm cancel');
    await this.popovercontroller.dismiss();
  }

  enviarNotificacion(data){
    console.log(data)

    this.uploadForm.get('service').setValue(this.idServicio);
    this.uploadForm.get('driver').setValue(this.servicesDriver.getId()); 
    this.uploadForm.get('client').setValue(this.idCliente); 
    this.uploadForm.get('data').setValue(JSON.stringify(data));

    var formData: any = new FormData();
    formData.append("service", this.uploadForm.get('service').value);
    formData.append("driver", this.uploadForm.get('driver').value);
    formData.append("client", this.uploadForm.get('client').value);
    formData.append("data", this.uploadForm.get('data').value);
    this.authService.sendNotification(formData);
  }
  
}
