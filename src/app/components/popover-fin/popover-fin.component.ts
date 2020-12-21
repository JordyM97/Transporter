import { Component, OnInit } from '@angular/core';
import { NavParams,PopoverController } from '@ionic/angular';
import { Router } from '@angular/router'
import { ShareDataService } from 'src/app/services/share-data.service';
import { EventEmitter } from '@angular/core';

enum COLORS {
  GREY = "#E0E0E0",
  GREEN = "#76FF03",
  YELLOW = "#FFCA28",
  RED= "#DD2C00"
}

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
  rating;
  ratingChange = new EventEmitter<object>();

  constructor(
    private router: Router,
    private navParams: NavParams, 
    private popover:PopoverController,
    private shareData: ShareDataService) {
    this.title=this.navParams.get("title");
    this.body=this.navParams.get("body");
    this.btn=this.navParams.get("btn");
   }

  ngOnInit() {

  }

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
      if(this.rating!= null){
        this.router.navigate(['/tabs']); 
      }
      else{
        console.log("Elije rating")
      }   
  }

  rate(index: number){
    this.rating = index;
    this.ratingChange.emit(this.rating);
    console.log(this.rating);
  }

  getColor(index: number){
    if(this.isAboveRating(index)){
      return COLORS.GREY;
    }
    switch (this.rating){
      case 1:
      case 2:
        return COLORS.RED;
      case 3:
        return COLORS.YELLOW;
      case 4:
      case 5:
        return COLORS.GREEN;
      default:
        return COLORS.GREY;
    }
  }

  isAboveRating(index: number): boolean {
    return index>this.rating;
  }
}
