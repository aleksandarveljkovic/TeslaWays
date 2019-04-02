import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview';
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
  
  imgData: any
  canvas: any    
  ctx: CanvasRenderingContext2D 
  options: CameraPreviewOptions

  constructor(public navCtrl: NavController, public navParams: NavParams, private cameraPreview: CameraPreview) {
    this.cameraPreview = cameraPreview
  }

  ionViewDidLoad() {
    this.options = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: "front",
      tapPhoto: true,
      previewDrag: false,
      toBack: true
    }

    this.canvas = document.querySelector("#canvas")
    this.ctx = this.canvas.getContext("2d")
    
    this.canvas.width = window.screen.width
    this.canvas.height = window.screen.height
  }

  stopPreview() {
    this.cameraPreview.stopCamera()
    .then((res) => {
        console.log("Stopping preview");
        
    })
    .catch((err) => {
        console.log("Error while stopping camera prew " + err);
        
    })
  }

  startPreview() {  
    this.cameraPreview.startCamera(this.options)
    .then((res) => {
      console.log("Started camera preview")
    })
    .catch((err) => {
      console.log("Error while starting camera preview")
    })
  }

  takePicture() { 
    this.startPreview()  
    let picOps: CameraPreviewPictureOptions = {
      width: this.canvas.width,
      height: this.canvas.height,
      quality: 100
    }
    
    this.cameraPreview.takePicture(picOps)
    .then((base64data) => {
      // Mirror uradi
      this.imgData = "data:image/jpeg;base64," + base64data;

      this.cameraPreview.hide()
      .catch((err) => {
        console.log("Error while hiding camera preview");
        
      });

      let picture = new Image();

      picture.src = this.imgData;
      this.canvas.width = window.screen.width
      this.canvas.height = window.screen.height
      this.ctx.drawImage(picture, 0, 0);

      

      this.stopPreview()
    })

  }

    ionViewWillLeave() {
      this.stopPreview()
    }
  }

  
