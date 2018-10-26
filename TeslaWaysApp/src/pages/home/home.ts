import { Tour } from './../../objekat/tura';
import { ObjectProvider } from './../../providers/object/object';
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
  tours: Tour[];
  constructor(public navCtrl: NavController,public platform: Platform, private objectProvider: ObjectProvider) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.tours = this.objectProvider.getData("asdasd");


    });
  }
  startGame() {
    this.navCtrl.push(GamePage, {tours: this.tours});
  }

}


