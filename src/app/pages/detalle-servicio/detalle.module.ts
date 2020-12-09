import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePageRoutingModule } from './detalle-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DetallePage } from './detalle.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePageRoutingModule,
    ComponentsModule
  ],
  declarations: [DetallePage]
})
export class DetallePageModule {}



