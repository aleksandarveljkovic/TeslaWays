import { Geolocation } from '@ionic-native/geolocation';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import leaflet from 'leaflet';
import { NativeLocator } from "../../nativeLocator/nativeLocator";
import 'leaflet-routing-machine';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map : any; ///Imamo pozamasnu gresku u lokaciji ///I na telefonu ne radi zoom automatski
  nativeLocator : NativeLocator;
  location : any;
  //44.8064000 20.48291
  geoLocations = 
    [{lat: 44.8064000, long:20.48291}, 
      {lat: 44.8074000, long:20.48291}, 
      {lat: 44.8014000, long:20.48291}];

  @ViewChild('map') mapContainer : ElementRef;
  constructor(public navCtrl: NavController) {

  }

  loadmap() {

    // this.map = leaflet.map('map').fitWorld();
    // leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attributions: 'http://www.teslaways.rs/',
    //   maxZoom: 18
    // }).addTo(this.map);

      this.map = leaflet.map('map');

      leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);

  leaflet.Routing.control({
      waypoints: [
        leaflet.latLng(this.geoLocations[0].lat, this.geoLocations[0].long),
        leaflet.latLng(this.geoLocations[1].lat, this.geoLocations[1].long)
      ]
  }).addTo(this.map);

    this.map.locate({

      setView : true, 
      maxZoom: 50,
      //watch : true
      
    }).on('locationfound', (e) => {

      //console.log("Your location has been found");
      console.log(e.latitude + "  " +  e.longitude);
      let markerGroup = leaflet.featureGroup();
      let marker : any = leaflet.marker([e.latitude, e.longitude]);

      let myIcon = leaflet.icon({

          iconUrl : '../../assets/cropMuzej.png',
          iconSize : [30, 30]
      });

      for(let i=0;i<this.geoLocations.length;i++) {

          //let tmpMarker : any = leaflet.marker([this.geoLocations[i].lat, this.geoLocations[i].long]);
          //console.log(this.geoLocations[i].lat + "  " + this.geoLocations[i].long);
          leaflet.marker([this.geoLocations[i].lat, this.geoLocations[i].long], 
                        {icon: myIcon}).addTo(this.map);
          //markerGroup.addLayer(tmpMarker);
      }

      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      //setLatLng(<LatLng> latlng)
      
    });
  }
//--------------------------------------------------------------
  onDeviceReady() {
    //this.nativeLocate();
    this.nativeLocator = new NativeLocator();
    this.location = this.nativeLocator.locate();
    console.log(location[1] + " " + location[2]);
  }
//-------------------------------------------------------------
  ionViewDidEnter(){
    
    // na androidu mora sa eventListenerom ali i dalje nista ne raid
    this.loadmap();
    //document.addEventListener("deviceready", this.loadmap, false);
    // this.onDeviceReady();
  }


  

  

}
