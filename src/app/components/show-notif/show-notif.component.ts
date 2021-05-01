import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavParams, Platform, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-show-notif',
  templateUrl: './show-notif.component.html',
  styleUrls: ['./show-notif.component.scss'],
})
export class ShowNotifComponent implements OnInit {
  title;
  body;
  width;height;
  constructor(
    private popover:PopoverController,
    private navParams: NavParams,
    private platform:Platform,
    private router: Router) 
    {
    this.width=this.platform.width;
    this.height=this.platform.height;
    this.title=this.navParams.get("title");
    this.body=this.navParams.get("body");
   }

  ngOnInit() {}
  async btnOK(){
    await this.popover.dismiss();
    //this.router.navigate(['home']);
  }
}
