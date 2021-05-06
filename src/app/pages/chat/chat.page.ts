import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

import { ChatScreenComponent } from 'src/app/components/chat-screen/chat-screen.component';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public chatRooms: any=[];
  isDetalle: any = {}

  constructor(
    public chatService: ChatService,
    private modal: ModalController,
    private router: Router,
    private activateRouter: ActivatedRoute,
  ) {
    this.activateRouter.paramMap.subscribe((data: any)=>{
      this.isDetalle = JSON.parse(data.params.datos);
      console.log(this.isDetalle)
    })
   }

  ngOnInit() {
    this.chatService.getChatRooms().subscribe(
      chats => {
        console.log("El arreglo de chats",chats)
        
        this.chatRooms=chats
      }
    )
  }

  openChat(chat){
    this.modal.create({
      component: ChatScreenComponent,
      componentProps:{
        chat: chat      
      }
    }).then(
      modal => {
        modal.present()
      }
    )
  }

  back(){
    this.router.navigateByUrl('/detalle-servicio');
  }

}
