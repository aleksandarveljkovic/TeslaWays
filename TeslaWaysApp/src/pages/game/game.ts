import { Geofence } from '@ionic-native/geofence';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Marker,
  MyLocationOptions,
  LatLng,
  Spherical,
  VisibleRegion,
  GoogleMapsEvent
} from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Tour } from '../../objekat/tura';


/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  visibleRegion: VisibleRegion;
  map : GoogleMap;
  myLocationMarker: {
    title: 'Starting position',
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
      {lat: 44.820114, lng: 20.459243}];
  
  tours: Tour[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public platform: Platform, public geolocation: Geolocation, private geofence : Geofence) {
    geofence.initialize().then(() => {
      alert('geofence ready');
      this.tours = this.navParams.get('tours');

      alert(this.tours[0].locations[0].questions[0].answers);
    });
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      alert("About to update!");
      this.updatePosition();
    });
  }



  ionViewDidLoad() {
    // alert("debug");
    this.platform.ready().then(() => {
      alert("Platform ready!!!");
      this.loadMap();

      // this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      //   alert("Mapa spremna!!!");
      //   this.proba();
      // });
    }).catch((err) => {
      alert(err);
    });
    // alert("debug 2");
  }

  updatePosition() {
    // alert("About to update osition....");
    
    let watcher = this.geolocation.watchPosition();

    watcher.subscribe((data) => {

      let currentLocation = new LatLng(data.coords.latitude, data.coords.longitude);

      
      
      // alert(this.visibleRegion.farLeft.lat + " " + this.visibleRegion.farLeft.lng);
      
      this.map.setCameraTarget(currentLocation);

    });
  }

  proba() {
    alert("u callbacku");
    this.visibleRegion = this.map.getVisibleRegion();
    alert("----" + this.visibleRegion);
  }

  loadMap() {

      
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
        
        // alert("-----"+this.visibleRegion.farLeft.lng);
        // this.visibleRegion = this.map.getVisibleRegion();
        // this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(this.getVisibleRegion);

        this.myLocationMarker = {
          title: 'Starting position',
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

        // alert("stampam mapu: " + this.map);

        this.addMarkers();
        
        
      }).catch((err) => {
        alert(err.message);
      });
  }

  getVisibleRegion() {
    this.visibleRegion = this.map.getVisibleRegion();
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
        // alert("pre setgeo: " + element.lat + " " + element.lng);
        this.setGeofence('Hardcoded '+i, element.lat, element.lng, "Muzej", "Ovo je lep muzej", i);
      });

      i++;
    });
  }

  setGeofence(id:string, lat :number, lng:number, title : string, desc : string, idx : number) {
    let fence = {
      id : id,
      latitude : lat, 
      longitude : lng, 
      radius : 70, 
      transitionType : 1,
      notification : {
        id : idx,
        title : "usao si u fence" + id,
        text : title,
        openAppOnClick : true

      }
    }

    this.geofence.addOrUpdate(fence).then(() => {
      alert("Dodao sam geofence");      
    }).catch((err) => {
      alert(err.message);
    });

  }

}
