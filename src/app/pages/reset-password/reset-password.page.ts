import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../services/auth.service";

import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  public correo_recuperacion:string=""

  constructor(
    private auth_service: AuthService, 
    private router: Router
  ) { }

  ngOnInit() {
  }

  send_reset_password(){
    console.log("Se enviara el correo...");
    this.auth_service.reset_password(this.correo_recuperacion);
    //this.router.navigate(['/login']);
  }

}
