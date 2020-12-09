import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFireAuth } from "@angular/fire/auth";
import { map } from 'rxjs/operators'
import { isNullOrUndefined } from 'util';
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class NotloginGuard implements CanActivate {
  
  constructor(
    private AFauth: AngularFireAuth,
    private router: Router
  ) {}

  /**
   * Dado el estado de la sesion de authenticacion, si es nulo permite el acceso(login) 
   * caso contrario redirige al home.
   * @param next 
   * @param state 
   * @returns tru en caso de que no haya una sesion y false si existe un usuario loggeado.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.AFauth.authState.pipe(map(auth => {
      console.log(auth)
      if (isNullOrUndefined(auth)) {
       
        return true
      } else {
        console.log(auth.email)
        console.log(auth.uid)
        this.router.navigate(['/home'])
        return false

      }
    }))
  }
  
}
