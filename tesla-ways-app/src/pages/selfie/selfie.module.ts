import { CameraPreview } from '@ionic-native/camera-preview';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelfiePage } from './selfie';

@NgModule({
  declarations: [
    SelfiePage,
  ],
  imports: [
    CameraPreview,
    IonicPageModule.forChild(SelfiePage),
  ],
})
export class SelfiePageModule {}
