import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBackComponent } from './header-back/header-back.component';
import { IonicModule } from '@ionic/angular';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { FormsModule } from '@angular/forms';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';



@NgModule({
  declarations: [
    HeaderBackComponent,
    ChatScreenComponent,
    TerminosCondicionesComponent,
  ],
  exports:[
    HeaderBackComponent,
    ChatScreenComponent,
    TerminosCondicionesComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class ComponentsModule { }
