import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class MediaServiceService {
  uploadProgress: any;
  pictureview:string;
  picture: any
  storageRef: any
  status: any
  profilephoto:any
  constructor(
    private toastCtrl:ToastController
  ) { this.storageRef= firebase.storage().ref()}

  async takePicture() {
    try {
      const profilePicture = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      //this.pictureview= profilePicture.webPath
      this.picture = profilePicture.base64String;

    } catch (error) {
      
      console.error("Take pic"+JSON.stringify(error));
    }
  }
  uploadProfile(id:any){
    var metadata = {      contentType: 'image/jpeg'    };
    var task=this.storageRef.child(`profile/${id}/profile.jpg`).putString(this.picture, 'base64');
    
    task.on('state_changed', function(snap){
      this.uploadProgress = (snap.bytesTransferred / snap.totalBytes) * 100;
      console.log('Upload is ' + this.uploadProgress + '% done');
      switch (snap.state) {
        case firebase.storage.TaskState.ERROR: // or 'paused'
          console.log('Upload is wee');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) { this.showToast("No se ha subido nada")}
    ,function() {});
    task.snapshot.ref.getDownloadURL().then((downloadURL)=>{
      this.pictureview=downloadURL;
      this.status=1;
      this.showToast("Subido Exitosamente!");
      console.log(this.pictureview)
    }); 
    if(this.status=0) this.showToast("No se ha subido nada")
  }
  upload(){
    var metadata = {      contentType: 'image/jpeg'    };
    var task=this.storageRef.child(`comentarios/as.jpg`).putString(this.picture, 'base64',metadata);
    
    task.on('state_changed', function(snap){
      this.uploadProgress = (snap.bytesTransferred / snap.totalBytes) * 100;
      console.log('Upload is ' + this.uploadProgress + '% done');
      switch (snap.state) {
        case firebase.storage.TaskState.ERROR: // or 'paused'
          console.log('Upload is wee');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) { this.showToast("No se ha subido nada")}
    ,function() {});
    task.snapshot.ref.getDownloadURL().then((downloadURL)=>{
      this.pictureview=downloadURL;
      this.status=1;
      this.showToast("Subido Exitosamente!");
      console.log(this.pictureview)
    }); 
    if(this.status=0) this.showToast("No se ha subido nada")
  }
  async getProfilePhoto(id: any){
    var task=this.storageRef.child(`profile/${id}/profile.jpg`);
    console.log(task)
    await task.getDownloadURL().then((downloadURL)=>{
      this.profilephoto=downloadURL;
      console.log(this.profilephoto)
      
    })
  }
  
  async showToast(msg:any){
    const toast = await this.toastCtrl.create({
      duration: 2000,
      message: msg
    });
    toast.present();
  }
}
