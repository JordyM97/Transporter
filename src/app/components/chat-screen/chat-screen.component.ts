import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController, NavParams } from '@ionic/angular';
import { Message } from 'src/app/interfaces/message';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

//Tomar fotos y cargar imagenes
import { PhotoCameraService } from 'src/app/services/photo-camera.service';



@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss'],
})
export class ChatScreenComponent implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  chat:any;
  messages:any[]=[];
  newMsg:string='';

  constructor(
    private modal_ctrl: ModalController,
    public chatService: ChatService,
    private nav_params: NavParams,
    private authService: AuthService,
    public photoService: PhotoCameraService,
  ) {
    
   }

  ngOnInit() {
    console.log(this.chat.id)
    this.chatService.getMessages(this.chat.id).subscribe(
      (messages: any[]) => {
        console.error('LosMessages > ',messages)
        this.messages=messages.map(
          msg => {
            
            let message:Message={
              createdAt:msg.createdAt,
              from: msg.from,
              msg: msg.msg,
              myMsg: msg.from === this.authService.userApp.uid
            };

            console.log('Message > ', message);

            return message;
            }    
        );
        console.error('Los New Messages > ',this.messages)
      }
    );
    this.chat=this.nav_params.get('chat');
    
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  sendMessage(){
    this.chatService.addChatMessage(this.chat.id,this.newMsg).then(
      () => {
        this.newMsg = '';
        this.content.scrollToBottom();
      }
    )
  }

  closeChat(){
    this.modal_ctrl.dismiss()
  }
}
