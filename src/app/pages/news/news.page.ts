import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  Noticias: Observable<any[]>;
  Noti: Array<JSON>;
  firestore:any
  constructor(private http: HttpClient,firestore: AngularFirestore) {
    this.firestore=firestore;
    this.Noti=Array<JSON>();
   }

  ngOnInit() {
    this.Noticias= this.firestore.collection('Noticias').valueChanges();

    this.Noticias.subscribe(value =>{
      this.Noti.push(value[0])
      console.log(value);
      
    });
  }

}
