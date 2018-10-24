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


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map : GoogleMap;
  myLocationMarker: {
    title: 'Passengers blejica',
    icon: 'red', //ovde moze nasa ikonica!!!
    animation: 'DROP',
    position: {
      lat: number, 
      lng: number
    },
    zoom: 18
  };
  myLocRealMarker: Marker;

  //44.8064000 20.48291
  geoLocations = 
    [{lat: 44.818137, lng: 20.456649}, 
      {lat: 44.816496, lng: 20.456625}, 
      {lat: 44.818886, lng: 20.457465}];

  constructor(public navCtrl: NavController,public platform: Platform, public geolocation: Geolocation) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      alert("Platform ready!!!");
      this.loadMap();
      alert("Loaded and about to update!");
      this.updatePosition();
    });
  }

  updatePosition() {
    let options: GeolocationOptions = {timeout: 7000};
    alert("About to update osition....");
    
    // alert(this.myLocRealMarker.getPosition.toString());
    let watcher = this.geolocation.watchPosition(options);

    watcher.subscribe((data) => {
      this.myLocationMarker.position.lat = data.coords.latitude;
      this.myLocationMarker.position.lng = data.coords.longitude;
      // alert("u subscribeu sam..");
      // let coords = new LatLng(data.coords.latitude, data.coords.longitude);

      // this.myLocRealMarker.setPosition(coords);
      // alert("setting marker to " + coords.lat + " " + coords.lng);

      this.map.addMarker(this.myLocationMarker).then((marker: Marker) => {
        marker.showInfoWindow();
        // this.myLocRealMarker = marker;
        
      });
    });
  }

  //44.81846 20.46436 Passengers bar :)
  loadMap() {
    //---------------------------------------
    ///za testiranje na browseru radimo ovaj kod
    // Environment.setEnv({
    //   'API_KEY_FOR_BROWSER_DEBUG': '',
    //   'API_KEY_FOR_BROWSER_RELEASE':''
    // });
    // --------------------------------------

      let option: MyLocationOptions = {
        enableHighAccuracy: true
      };
      
      this.geolocation.getCurrentPosition(option).then((position) => {
        alert("current location via native geolocation: " + position.coords.latitude + " " + position.coords.longitude);
        let mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: position.coords.latitude, 
              lng: position.coords.longitude
            },
            zoom: 18,
            tilt: 30
          }
        };    
        
        this.map = GoogleMaps.create('map_canvas', mapOptions);
    
        this.myLocationMarker = {
          title: 'Passengers blejica',
          icon: 'red', //ovde moze nasa ikonica!!!
          animation: 'DROP',
          position: {
            lat: position.coords.latitude, 
            lng: position.coords.longitude
          },
          zoom: 18
        };
        this.map.addMarker(this.myLocationMarker).then((marker: Marker) => {
          marker.showInfoWindow();
          this.myLocRealMarker = marker;
          // callback();
        });

        this.addMarkers();
        
        
      }).catch((err) => {
        alert(err.message);
      });
  }

  addMarkers() {
    let i = 1;
    this.geoLocations.forEach(element => {
      this.map.addMarker({
        title: 'Hardcoded '+i,
        icon: 'blue', //ovde moze nasa ikonica!!!
        animation: 'DROP',
        position: {
          lat: element.lat, 
          lng: element.lng
        },
        zoom: 18
      }).then((marker: Marker) => {
        marker.showInfoWindow();
      });

      i++;
    });
  }
}


