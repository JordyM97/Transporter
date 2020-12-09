import { Injectable } from '@angular/core';


//Dependencias para el uso de la camara y acceso a los archivos
import {
  Plugins,
  CameraResultType,
  Capacitor,
  FilesystemDirectory,
  CameraPhoto,
  CameraSource
} from '@capacitor/core';

import { Platform } from '@ionic/angular';

import { Photo } from '../interfaces/photo';

const {
  Camera,
  Filesystem,
  Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class PhotoCameraService {

  //Contenedor de referencias de cada foto
  public photos: Photo[] = [];
  private platform: Platform;
  private PHOTO_STORAGE: string = "photos";//Llave del store

  /**
   * Importe la API de la plataforma Ionic en photo-camera.service.ts, 
   * que se utiliza para recuperar información sobre el dispositivo 
   * actual. En este caso, es útil para seleccionar qué código ejecutar 
   * según la plataforma en la que se ejecuta la aplicación (web o móvil).
   * @param platform 
   */
  constructor(
    platform: Platform
  ) {
    this.platform = platform;
  }

  public async addNewToGallery() {
    // Tomar una foto con la camara del dispositivo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImgFile = await this.savePicture(capturedPhoto);

    // this.photos.unshift({
    //   filepath: "soon...",
    //   webviewPath: capturedPhoto.webPath
    // });
    this.photos.unshift(savedImgFile);

    //Almacenar el arreglo de photos, persistencia de imgs
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);

  });

  //Lee la foto segun la plataforma donde se ejecuta
  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" detecta Cordova o Capacitor
    if (this.platform.is('hybrid')) {
      // Lee el archivo en base64
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      return file.data;
    }
    else {
      // Obtener la foto, léala como un blob y luego conviértala al formato base64
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }


  /**
   * Con la ayuda de Filesystem APi de Capacitor podemos almacenar fotos
   * en el filesystem.
   * @param cameraPhoto representa una nueva foto
   */
  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convertir a base64 format, Filesystem API para guardar
    const base64Data = await this.readAsBase64(cameraPhoto);

    //Escribir la data en el directorio
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });


    if (this.platform.is('hybrid')) {
      // Reescribir la ruta para mostrar la imagen
      // https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // WebPath para mostrar la img cargada en memoria
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }

  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data
        });

        // Web platform only: Cargar la foto como base64 format
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

}


