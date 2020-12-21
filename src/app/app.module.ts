import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


//Importar los metodos de la clase firebaseConfig
import {firebaseConfig} from '../environments/environment'
import {AngularFireModule} from '@angular/fire'
import {AngularFireAuthModule} from '@angular/fire/auth'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { ComponentsModule } from './components/components.module';
import { PopoverInicioFinComponent }from 'src/app/components/popover-inicio-fin/popover-inicio-fin.component';
import { PopoverFinComponent } from 'src/app/components/popover-fin/popover-fin.component';
import { PopoverMapaComponent } from 'src/app/components/popover-mapa/popover-mapa.component';

//Para usar llamadas nativas
import { CallNumber } from '@ionic-native/call-number/ngx';

import { HttpService } from "./services/http.service";
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [AppComponent, PopoverInicioFinComponent, PopoverFinComponent, PopoverMapaComponent],
  entryComponents: [PopoverInicioFinComponent, PopoverFinComponent, PopoverMapaComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    ComponentsModule,
    ReactiveFormsModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,LaunchNavigator,
    CallNumber,
    HttpService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}