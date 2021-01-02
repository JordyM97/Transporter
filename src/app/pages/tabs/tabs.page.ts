import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { PhotoCameraService } from 'src/app/services/photo-camera.service';
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
    public photoService: PhotoCameraService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.data = params.get('data')
        console.log('This the notification data: '+this.data);
      }
    )
  }
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
  resetBadgeCount(){
    PushNotifications.removeAllDeliveredNotifications();
  }

}
