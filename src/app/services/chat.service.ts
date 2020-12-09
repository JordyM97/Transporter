import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'
import { ChatRoom } from '../interfaces/chat-room';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatCollection: AngularFirestoreCollection<any>;
  private chatRooms: Observable<any[]>;;

  private messagesCollection: AngularFirestoreCollection<any>;
  public messages: Observable<any[]>;




  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,

  ) {
    this.chatCollection = this.afs.collection<any>('chatRoomsTest');
    this.chatRooms = this.chatCollection.snapshotChanges();

   }

  getChatRooms(){
    return this.chatRooms.pipe(
      map(
        rooms => {
          return rooms.map(
            item => {
              const data: ChatRoom = item.payload.doc.data() as ChatRoom;
              data.id=item.payload.doc.id;
              return data;
              
            }
          ).filter(data => {
              console.log('ChatRoom.id > ',data.id);
              let uids =data.id.split('-');
              let uidProv= uids[0];
              let uidOther= uids[1];
              let uidCurrent = this.authService.userApp.uid;
              console.log(this.authService.userApp);
              return (uidCurrent===uidProv || uidCurrent==uidOther)
              
          });
        }
      )
    )
  }

  getMessages(chatRoom:string){
    console.log('cg> ',chatRoom)
    this.messagesCollection = this.afs.collection<any>(`/chatRoomsTest/${chatRoom}/messages`,(ref)=>ref.orderBy('createdAt'));
    return this.messagesCollection.valueChanges();
  }

  addChatMessage(chatRoom:string,msg:string){
    return this.afs.collection(`/chatRoomsTest/${chatRoom}/messages`).add(
      {
        msg,
        from: this.authService.userApp.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }
    );
  }
/*
  getChatMessages(){
    let users = [];

    return this.getUsers().pipe(
      switchMap(
        res => {
          users = res;
          console.log('All USERS: ',users);
          return this.afStore.collection('messages',
          ref => ref.orderBy('createdAt')
          ).valueChanges({
            idField: 'id'
          }) as Observable<Message[]>;
        }
      ),map(
        messages => {
          for(let m of messages ){
            m.fromName = this.getUserForMsg(m.from,users);
            m.myMsg = this.currentUser.uid == m.from;
          }
          console.log('All MESSAGES: ',messages);
          return messages;
        }
      )
    )
  }
*/
}
