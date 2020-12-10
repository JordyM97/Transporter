import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
    ) {}
  
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
    if(this.authService.token==""){
      //this.router.navigateByUrl("login");
      return false;
      
    }else{
      return true;
    }

  }
  
}
