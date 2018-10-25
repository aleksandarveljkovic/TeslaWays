// import { GoogleMaps, GoogleMap, Environment, Marker, BaseArrayClass, MyLocationOptions, LocationService, MyLocation } from '@ionic-native/google-maps';

import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import 'leaflet-routing-machine';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Marker,
  MyLocationOptions,
  LatLng
} from '@ionic-native/google-maps';
import { GamePage } from '../game/game';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,public platform: Platform) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
    });
  }
  startGame() {
    this.navCtrl.push(GamePage);
  }

}


