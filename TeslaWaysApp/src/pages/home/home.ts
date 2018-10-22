
// import { GoogleMaps, GoogleMap, Environment, Marker, BaseArrayClass, MyLocationOptions, LocationService, MyLocation } from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import leaflet from 'leaflet';
import { NativeLocator } from "../../nativeLocator/nativeLocator";
import 'leaflet-routing-machine';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  MyLocationOptions,
  MyLocation,
  LocationService
} from '@ionic-native/google-maps';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map : GoogleMap;
  
  // POINTS: BaseArrayClass<any> = new BaseArrayClass<any>([
  //   {
  //     position: {lat: 44.8064000, lng:20.48291},
  //     iconData: 'blue' //i ovde stavi nasu ikonicu
  //   },
  //   {
  //     position: {lat: 44.8074000, lng:20.48291},
  //     iconData: 'blue' //i ovde stavi nasu ikonicu
  //   },
  //   {
  //     position: {lat: 44.8014000, lng:20.48291},
  //     iconData: 'blue' //i ovde stavi nasu ikonicu
  //   },
    
  // ]);

  //44.8064000 20.48291
  // geoLocations = 
  //   [{lat: 44.8064000, long:20.48291}, 
  //     {lat: 44.8074000, long:20.48291}, 
  //     {lat: 44.8014000, long:20.48291}];

  constructor(public navCtrl: NavController,private platform: Platform) {
    platform.ready().then(() => {
      this.loadMap();
    });
  }

  ionViewDidLoad(){
    
    //  this.loadMap();
  }


  //44.81846 20.46436 Passengers bar :)
  loadMap() {

    //---------------------------------------
    ///za testiranje na browseru radimo ovaj kod
    // Environment.setEnv({
    //   'API_KEY_FOR_BROWSER_DEBUG': '',
    //   'API_KEY_FOR_BROWSER_RELEASE':''
    // });
    // ------------------------------

    // let option: MyLocationOptions = {
    //   enableHighAccuracy: true
    // };

    // LocationService.getMyLocation(option).then((location: MyLocation) => {
    //   this.map = GoogleMaps.create('map_canvas', {
    //     'center': location.latLng,
    //     'zoom': 16
    //   });


    // }).catch((error: any) => {
    //   console.log(error);
    // });

    // let moja = LocationService.getMyLocation(option);
    
    // LocationService.getMyLocation(option).then((location: MyLocation) => {
  
    // }).catch((error: any) => {
    //   alert(error);
    // });

    
    let mapOptions: GoogleMapOptions = {
      camera: {
        // target: location,
        target: {
          lat: 44.81846,
          lng: 20.46436
        },
        zoom: 18,
        tilt: 30
      }
    };    
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    this.map.addMarker({
      title: 'Passengers blejica',
      icon: 'blue', //ovde moze nasa ikonica!!!
      animation: 'DROP',
      position: {
        lat: 44.81846,
        lng: 20.46436
      },
      zoom: 8
    }).then((marker: Marker) => {
      marker.showInfoWindow();
    });

    // LocationService.getMyLocation().then((location: MyLocation) => {
    //   alert("eto me na " + location.latLng.toString());
    // });
    
  }

}
