import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { ServicesDriverService } from 'src/app/services/services-driver.service';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverMapaComponent } from '../popover-mapa/popover-mapa.component';
import { ChatService } from '../../services/chat.service';
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
  pkServicio;
  uploadForm: FormGroup;

  constructor(
    private router: Router,
    private navParams: NavParams,
    private popovercontroller:PopoverController,
    private formBuilder: FormBuilder,
    private servicesDriver: ServicesDriverService,
    private authService: AuthService,
    private chatService: ChatService,
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
    this.pkServicio = this.navParams.get("pkServicio")
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

  async btnSi(){
    console.log(this.idCliente);
    this.authService.idCliente=this.idCliente;
   
    //Almacenamiento local de variables para notificaciones
    localStorage.setItem("idCliente",this.idCliente);
    localStorage.setItem("idConductor",this.servicesDriver.getId());
    localStorage.setItem("idServicio",this.pkServicio);

    this.notificacionCareApp = {  /*VALOR DE PRUEBA*/
      nombreConductor: this.servicesDriver.getName(),
      apellidoConductor: this.servicesDriver.getLastName(),
      calificacionConductor: '5',
      telefonoConductor: '0999999999',
      modeloVehiculo: this.servicesDriver.getModel(),
      placaVehiculo: this.servicesDriver.getBrand(),
      colorVehiculo: this.servicesDriver.getColor(),
      inicioCoords: this.inicioCoords,
      finCoords: this.finCoords,
      idConductor: this.servicesDriver.idDriver,
      tipoNotificacion: '0' //Indica si es noti de inicio o fin de carrera; 0=inicio 1=finCalificar
    }
    this.enviarNotificacion(this.notificacionCareApp);
    
    this.chatService.addChatRoom(this.authService.userApp.uid+'-'
    +localStorage.getItem("uidClient")+'-'+this.pkServicio);
    this.router.navigate(['/detalle']);
    await this.popovercontroller.dismiss();
  }

  async btnNo(){
    console.log('Confirm cancel');
    await this.popovercontroller.dismiss();
  }

  enviarNotificacion(data){
    console.log(data)

    this.uploadForm.get('service').setValue(localStorage.getItem("idServicio"));
    this.uploadForm.get('driver').setValue(localStorage.getItem("idConductor")); 
    this.uploadForm.get('client').setValue(localStorage.getItem("idCliente")); 
    this.uploadForm.get('data').setValue(JSON.stringify(data));

    var formData: any = new FormData();
    formData.append("service", this.uploadForm.get('service').value);
    formData.append("driver", this.uploadForm.get('driver').value);
    formData.append("client", this.uploadForm.get('client').value);
    formData.append("data", this.uploadForm.get('data').value);
    this.authService.sendNotification(formData);
  }
  
}
