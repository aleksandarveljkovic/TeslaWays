import { GoogleMaps, GoogleMap, Environment } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import leaflet from 'leaflet';
import { NativeLocator } from "../../nativeLocator/nativeLocator";
import 'leaflet-routing-machine';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map : GoogleMap;
  
  //44.8064000 20.48291
  // geoLocations = 
  //   [{lat: 44.8064000, long:20.48291}, 
  //     {lat: 44.8074000, long:20.48291}, 
  //     {lat: 44.8014000, long:20.48291}];

  constructor(public navCtrl: NavController) {

  }

  ionViewDidLoad(){
    
    this.loadMap();
  }

  loadMap() {

    //---------------------------------------
    ///za testiranje na browseru radimo ovaj kod
    // Environment.setEnv({
    //   'API_KEY_FOR_BROWSER_DEBUG': '',
    //   'API_KEY_FOR_BROWSER_RELEASE':''
    // });
    // ------------------------------

    this.map = GoogleMaps.create('map_canvas');



  }

}
