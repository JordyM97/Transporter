import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

import { ChatScreenComponent } from 'src/app/components/chat-screen/chat-screen.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public chatRooms: any=[];

  constructor(
    public chatService: ChatService,
    private modal: ModalController,
  ) { }

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

}
