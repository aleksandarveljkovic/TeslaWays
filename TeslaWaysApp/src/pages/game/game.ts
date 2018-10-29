import { Question } from './../../objekat/question';
import { Geofence } from '@ionic-native/geofence';
import { Component, WrappedValue } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  Platform, 
  AlertController, 
  LoadingController} from 'ionic-angular';
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
import { Storage } from '@ionic/storage';
import { isRightSide } from 'ionic-angular/umd/util/util';



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
  currentLocationIndex : number;
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

  tours: Tour[];
  locations: any;
  currentGeofenceTriggered: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform, 
              public geolocation: Geolocation, 
              private geofence : Geofence,
              private alertCtrl: AlertController, 
              private storage : Storage) {
    
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      // alert("About to update!");
      this.updatePosition();
    });
  }



  ionViewDidLoad() {
    // alert("debug");
    this.platform.ready().then(() => {
      alert("Platform ready!!!");

      this.geofence.initialize().then(() => {
        alert('geofence ready');
        
      });
  
      this.tours = this.navParams.get('tours');
      // alert(this.tours[0].locations[0].questions[0].answers);
      this.locations = this.tours[0].locations;

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

  getCurrentIndexFromStorage() : Promise<any> {
    return this.storage.get('index');
  }

  loadMap() {

      
      let option: MyLocationOptions = {
        enableHighAccuracy: true
      };
      
      const currInd = this.getCurrentIndexFromStorage();
      currInd
        .then((val) => {
          this.currentLocationIndex = val;
        })

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
        
        this.map.on(GoogleMapsEvent.MAP_READY)
          .subscribe(() => {
            alert("MAP READY triggered!");
            // let nesto = this.map.getVisibleRegion();
            // alert(nesto.southwest + " " + nesto.northeast);
            
            // this.visibleRegion = this.map.getVisibleRegion();
            // // alert(this.visibleRegion.farRight.lat + " " + this.visibleRegion.farRight.lng);
            // this.map
            //   .fromLatLngToPoint(this.visibleRegion.farRight)
            //   .then((data) => {
            //     alert("[from latlngtopoint] " + data.keys.arguments);
            //   });
          });

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
        });

        //this.addMarkers();
        this.setCurrentState();
        
        
      }).catch((err) => {
        alert(err.message);
      });
  }

  getVisibleRegion() {
    this.visibleRegion = this.map.getVisibleRegion();
  }

  addMarkers() {
    let i = 1;
    this.locations.forEach(element => {
      this.map.addMarker({
        title: element.id,
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
        this.setGeofence(element.id, element.lat, element.lng, element.title, "Ovo je lep muzej", i);
      });

      i++;
    });
  }

  addMarker(index : any) {
    this.map.addMarker({
      title : this.locations[index].id, 
      icon : 'blue',
      animation : 'DROP',
      position : {
        lat : this.locations[index].lat, 
        lng : this.locations[index].lng, 
      },
      zoom : 18

    }).then((marker : Marker) => {
      this.setGeofence(this.locations[index].id, this.locations[index].lat, this.locations[index].lng, this.locations[index].title, "Ovo je lep muzej", index);
    });
  }

  setCurrentState() {

    if(this.currentLocationIndex == undefined) {
        this.addMarker(0);
        this.currentLocationIndex=0;
    }
    else {

      for(let i=0;i<=this.currentLocationIndex;i++) {
        this.addMarker(i);
      }
    }

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
      // alert("Dodao sam geofence");      
    }).catch((err) => {
      alert(err.message);
    });

    this.geofence.onTransitionReceived()
      .subscribe(() => {
        // alert(response);
        // alert("Usao si u geofence, sad bih ti pop upovao pitanje\n" + geofence.keys);
        this.popUpQuestion();
      });

  }

  wrapper() {
    alert("Dobar si");
  }

  popUpQuestion() {

    let questions: Question[] = this.locations[this.currentLocationIndex].questions;
    let a = Math.floor((Math.random()*100)%questions.length);
    let q = questions[a];

    const buttons = [{
      text: "Odgovori",
      handler : (data) => {
        if(data == q.true) {
          this.wrapper();
          
        }
      }
    }, "Dismiss"];

    const inputs = [{
      type: "radio",
      value: q.answers[0],
      id: "1",
      label: q.answers[0]
    }, 
    {
      type: "radio",
      value: q.answers[1],
      id: "2",
      label: q.answers[1]
    }
  ];

    const options = {
      title: "Pitanje",
      subTitle: "Pitanje za lokaciju " + this.locations[this.currentLocationIndex].title,
      buttons: buttons,
      inputs: inputs, 
      message : q.question
    };
    const alert = this.alertCtrl.create(options);
    alert.present();
    this.currentLocationIndex = 2;
    this.storage.set('index', this.currentLocationIndex);
  }

}
