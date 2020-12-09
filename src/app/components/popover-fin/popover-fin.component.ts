import { Component, OnInit } from '@angular/core';
import { NavParams,PopoverController } from '@ionic/angular';
import { Router } from '@angular/router'

@Component({
  selector: 'app-popover-fin',
  templateUrl: './popover-fin.component.html',
  styleUrls: ['./popover-fin.component.scss'],
})
export class PopoverFinComponent implements OnInit {
  title;
  body;
  btn;
  watch:any;
  constructor(private router: Router,private navParams: NavParams, private popover:PopoverController) {
    this.title=this.navParams.get("title");
    this.body=this.navParams.get("body");
    this.btn=this.navParams.get("btn");
   }

  ngOnInit() {}

  /*private bloquearInicio(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = true;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = false;
  }*/

  private bloquearFin(){
    (<HTMLInputElement> document.getElementById("confirmar")).disabled = false;
    (<HTMLInputElement> document.getElementById("finalizar")).disabled = true;
  }

  private stopWatch(){
    this.watch=null;
  }

 /* async iniciarServicio(){
    console.log('CONFIRM ACEPTAR');
    this.bloquearInicio();
    await this.popover.dismiss();
        
  }*/

  async finalizarServicio(){
    console.log('CARRERA FINALIZADA');
          this.stopWatch();
          //this.detalle.geocodeLatLng();          
          this.bloquearFin();
          await this.popover.dismiss();
          this.router.navigate(['/tabs']);
          
  }
}
