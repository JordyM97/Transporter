import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
const {PushNotifications} = Plugins;

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  data: any=null;

  constructor(
    private route:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.data = params.get('data')
        console.log('This the notification data: '+this.data);
      }
    )
  }

  resetBadgeCount(){
    PushNotifications.removeAllDeliveredNotifications();
  }

}
