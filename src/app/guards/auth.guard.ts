import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { map } from 'rxjs/operators'
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private AFauth: AngularFireAuth,
    private router: Router) {

  }
  
  /**
   * Dado el estado de la sesion de authentication si es nulo, redirige al login
   * y si hay una sesion activa(loggeado) permite acceder al home (true).
   * @param next 
   * @param state 
   * @returns true si tiene acceso a la pantalla (home), falso caso contrario.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.AFauth.authState.pipe(map(auth => {
        console.log(auth)
        if (isNullOrUndefined(auth)) {
          this.router.navigate(['/login'])
          return false
        } else {
          console.log(auth.email)
          console.log(auth.uid)
          return true
  
        }
  
      }))
  
  
  }
  
}
