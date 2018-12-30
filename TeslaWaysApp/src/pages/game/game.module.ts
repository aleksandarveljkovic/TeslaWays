import { Vibration } from '@ionic-native/vibration';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GamePage } from './game';

@NgModule({
  declarations: [
    GamePage,
  ],
  imports: [
    GoogleMaps,
    Geolocation,
    Vibration,
    IonicPageModule.forChild(GamePage),
  ],
})
export class GamePageModule {}
