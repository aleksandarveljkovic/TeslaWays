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
    this.platform.ready().then(() => {
      alert("Platform ready!!!");

      this.geofence.initialize().then(() => {
        alert('geofence ready');
        
      });
  
      
        this.tours = this.navParams.get('tours');
        // alert(this.tours[0].locations[0].questions[0].answers);
        this.locations = this.tours[0].locations;
  
        this.loadMap();
      
    }).catch((err) => {
      alert(err);
    });
    
  }

  

  updatePosition() { 
    let watcher = this.geolocation.watchPosition();

    watcher.subscribe((data) => {
      let currentLocation = new LatLng(data.coords.latitude, data.coords.longitude);   
      this.map.setCameraTarget(currentLocation);
    });
  }

  getCurrentObjectFromStorage() : Promise<any> {
    return this.storage.get("index");
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

        this.map.on(GoogleMapsEvent.MAP_READY)
          .subscribe(() => {
            alert("MAP READY triggered!");
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


      const currInd = this.getCurrentObjectFromStorage();
      currInd.then((val) => {
        this.currentLocationIndex = val;  
        alert("currindex " + this.currentLocationIndex);

        this.setCurrentState();       
      });

              
      }).catch((err) => {
        alert(err.message);
      });
  }  

  addMarker(index : any) {
    this.map.addMarker({
      title : this.locations[index].id, 
      icon : 'blue', // e brate i ovde moze nasa ikonica!!!
      animation : 'DROP',
      position : {
        lat : this.locations[index].lat, 
        lng : this.locations[index].lng, 
      },
      zoom : 18

    }).then((marker : Marker) => {
      if (index == this.currentLocationIndex)
        this.setGeofence(this.locations[this.currentLocationIndex].index + "", 
                          this.locations[this.currentLocationIndex].lat, 
                          this.locations[this.currentLocationIndex].lng, 
                          this.locations[this.currentLocationIndex].title, 
                          "Ovo je lep muzej", 
                          index);
    });
  }

  setCurrentState() {
    if (this.currentLocationIndex == undefined) {
      this.currentLocationIndex = 0;
      this.addMarker(0);
    }
    else {
      for (let i = 0; i <= this.currentLocationIndex; i++) {
        this.addMarker(i);
      }
    }
  }


  setGeofence(id:string, lat :number, lng:number, title : string, desc : string, idx : number) {
    let fence = {
      id : id,
      latitude : lat, 
      longitude : lng, 
      radius : 100, 
      transitionType : 1,
      notification : {
        id : idx,
        title : "usao si u fence" + id,
        text : title,
        openAppOnClick : true

      }
    }

    this.geofence.addOrUpdate(fence).then(() => {
      alert("E bato evo geofence-a :) na lokaciji " + id);   
    }).catch((err) => {
      alert(err.message);
    });

    this.geofence.onTransitionReceived()
      .subscribe(() => {
        this.alertWrap("Usao u geofence " + id);
        this.popUpQuestion();
      });

  }

  

  popUpQuestion() {
    this.alertWrap("Usao sam u popup q");
    let questions: Question[] = this.locations[this.currentLocationIndex].questions;
    let a = Math.floor((Math.random()*100)%questions.length);
    let q = questions[a];

    const buttons = [{
      text: "Odgovori",
      handler : (data) => {
        if(data == q.true) {
          this.geofence
            .remove(this.locations[this.currentLocationIndex].index + "")
            .then(() => {
              this.alertWrap("removed geofence from location " + this.locations[this.currentLocationIndex].id);
              this.locations[this.currentLocationIndex].answered = true;
              this.wrapper();
            });
        }
      }
     }, "Zatvori"];

    const answers: any[] = q.answers;

    let inputs = new Array();

    let offAns;  

    for (let i = 0; i < answers.length; i++) {
      offAns = {
        type: "radio",
        value: answers[i],
        id: i,
        label: answers[i]
      }

      inputs.push(offAns); 
    }

    const options = {
      title: "Pitanje",
      subTitle: "Pitanje za lokaciju " + this.locations[this.currentLocationIndex].id,
      buttons: buttons,
      inputs: inputs, 
      message : q.question
    };
    const alert = this.alertCtrl.create(options);
    alert.present();
  }

  wrapper() {
    alert("Tacan odgovor juuuhuuuu :)");

    this.currentLocationIndex++;
    this.storage
      .set("index", this.currentLocationIndex)
      .then(() => {
        this.setCurrentState();
      });
  }

  clearStorage() {
    this.storage
      .ready()
      .then(() => {
        this.storage
          .remove("index")
          .then(() => {
            alert("Removed index...");
          })
          .catch(() => {
            alert("There's no index to remove :)");
          });
      });
  }

  alertWrap(param) {
    alert(param);
  } 

  // addMarkers() {
  //   let i = 1;
  //   this.locations.forEach(element => {
  //     this.map.addMarker({
  //       title: element.id,
  //       icon: 'blue', //ovde moze nasa ikonica!!!
  //       animation: 'DROP',
  //       position: {
  //         lat: element.lat, 
  //         lng: element.lng
  //       },
  //       zoom: 18
  //     }).then((marker: Marker) => {
  //       marker.showInfoWindow();
  //       this.setGeofence(element.id, element.lat, element.lng, element.title, "Ovo je lep muzej", i);
  //     });

  //     i++;
  //   });
  // }

}
