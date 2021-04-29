import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MediaServiceService } from 'src/app/services/media-services.service';
import { ServicesDriverService } from 'src/app/services/services-driver.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  public nombre: any;
  public apellido: any;
  public correo: any;
  private idCliente: any;
  private calificacion = 0;
  private calificacionStr;
  public user: any;
  public img:string="https://firebasestorage.googleapis.com/v0/b/vehicular-287023.appspot.com/o/profile%2F24%2Fprofile.jpg?alt=media&token=b7f2e110-bde3-4d30-a509-9ccb27c122ea";
  constructor(
    public authService: AuthService,
    public Mediaservice:MediaServiceService,
    public DriverService: ServicesDriverService
    ) {
      
    }

  ngOnInit() {
    //Obtenidos los datos del usuario luego de loguear
    this.askProfilePic();
    //this.img=''//this.Mediaservice.profilephoto;
    this.nombre = this.DriverService.getName();
    this.apellido = this.DriverService.getLastName();
    this.correo = this.DriverService.getEmail();
    //this.getRateUser();
    this.user=this.authService.userinfo;
    
    }
    async uploadImg(){
      await this.Mediaservice.takePicture();
    }
    getRateUser(){
      console.log(this.DriverService.getRecordD())
      this.DriverService.getRecordD().forEach(element => {
        this.calificacion += parseFloat(element.clientScore);
      });
      this.calificacion = this.calificacion/this.DriverService.getRecordD().length;
      this.calificacionStr = this.calificacion.toFixed(2);
    }
    async askProfilePic(){
      await this.Mediaservice.getProfilePhoto(this.authService.id);
    }

}
