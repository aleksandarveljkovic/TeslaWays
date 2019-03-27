import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SelfiePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-selfie',
  templateUrl: 'selfie.html',
})
export class SelfiePage {
  
  imgData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private cameraPreview: CameraPreview) {
    this.cameraPreview = cameraPreview
  }

  ionViewDidLoad() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 60,
      y: 60,
      width: window.screen.width * 70/100,
      height: window.screen.height * 40/100,
      camera: "front",
      tapPhoto: true,
      previewDrag: false,
      toBack: true,
      alpha: 0.5
    }
    console.log("hello there");

    this.cameraPreview.startCamera(cameraPreviewOpts)
    .then((res) => {
      console.log("Started camera preview")
    })
    .catch((err) => {
      console.log("Error while starting camera preview")
    })  
    
  }

  takePicture() {
    console.log("Button pressed!");
    

    this.cameraPreview.takePicture({width: window.screen.width * 70/100, height: window.screen.height * 40/100})
    .then((base64data) => {
      this.imgData = "data:image/jpeg;base64," + base64data;

      this.cameraPreview.hide()
      .catch((err) => {
        console.log("Error while hiding camera preview");
        
      });

      const canvas: any = document.querySelector("#canvas");
      
      const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

      let picture = new Image();

      picture.src = this.imgData;

      ctx.drawImage(picture, 0, 0);
    })

  }

  ionViewWillLeave(){
    this.cameraPreview.stopCamera()
    .then((res) => {
      console.log("Stopping preview");
      
    })
    .catch((err) => {
      console.log("Error while stopping camera prew " + err);
      
    })
  }

}
