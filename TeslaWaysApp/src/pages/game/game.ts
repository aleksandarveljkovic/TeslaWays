import { Question } from './../../objekat/question';
import { Geofence } from '@ionic-native/geofence';
import { Component} from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  NavParams, 
  Platform, 
  AlertController} from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Marker,
  MyLocationOptions,
  LatLng,
  GoogleMapsEvent
} from '@ionic-native/google-maps';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { Tour } from '../../objekat/tura';
import { Storage } from '@ionic/storage';
import { Location } from '../../objekat/locations';
import { Vibration } from '@ionic-native/vibration';


@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
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

  tours: Tour;
  locations: Location[];
  currentGeofenceTriggered: any;
  answeredLocations: number[]; // Niz indeksa lokacija koje su odgovorene tacno
  currrentCoords: LatLng;
  setAnsweredQuestions: Set<number> = new Set();
  pendingQuestion: Question;

  currentGeofences: Set<number> = new Set();

  locationsForSort: Location[];

  endGameAlert = this.alertCtrl.create({
    title: 'VUUUUHUUUU',
    subTitle: 'Ti si ultra car i odgovorio si sva pitanja zavrsio rutu itd itd :)',
    buttons: ['Zatvori']
  });

  gameFinished: boolean = false;

  NUM_OF_CLOSEST: number = 2;

  mapDrag: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform, 
              public geolocation: Geolocation, 
              private geofence : Geofence,
              private alertCtrl: AlertController, 
              private storage : Storage,
              private vibration: Vibration) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.geofence.initialize().then(() => {
        console.log("Geofence radi");
        
      });
    
      // JOS SE POIGRAJ KAD JE IGRA ZAVRSENA STA SE DESAVA
      this.storage.ready().then(() => {
        this.storage.get("gameFinished")
          .then((value) => {
            this.gameFinished = value == undefined ? false : true;

            this.loadSetAnswered();
            this.loadCurrentGeofences();
            this.tours = this.navParams.get('tours');
            this.locations = this.tours.locations;
            this.locationsForSort = Array.from(this.locations);
          });
      });
        this.loadMap();
      
    }).catch((err) => {
      alert(err);
    });
    
  }

  initializeMarkers() {
    this.locations.forEach(location => {
      this.map.addMarker({
        title : location.id, 
        icon : 'blue', // e brate i ovde moze nasa ikonica!!!
        animation : 'DROP',
        position : {
          lat : location.lat, 
          lng : location.lng, 
        },
        zoom : 25
        
      }).then((marker : Marker) => {
        console.log("[initialize markers] dodao marker na " + marker.getTitle());
      });
    });
  }

  sortLocations() {
    const myLat = this.currrentCoords.lat;
    const myLng = this.currrentCoords.lng;

    this.locationsForSort.sort((a, b) => {
      if (this.getDistanceFromLatLonInKm(myLat, myLng, a.lat, a.lng) < this.getDistanceFromLatLonInKm(myLat, myLng, b.lat, b.lng)) {
        return -1;
      }
      else {
        return 1;
      }
    });
  }

  loadSetAnswered() { 
    this.storage.get("setAnsweredQuestions")
      .then((value) => {
        if (value == undefined) {
          console.log("Answered questions are empty");
          this.setAnsweredQuestions = new Set();
        }
        else {
          this.setAnsweredQuestions = value;

          let message = "Answered locations: ";
          this.setAnsweredQuestions.forEach(element => {
            message += element + " "
          });

          console.log(message);
        }
      });
  }

  loadCurrentGeofences() {
    this.storage.get("currentGeofences")
      .then((value) => {
        if (value != undefined) {
          this.currentGeofences = value;

          let message = "current geofences: ";
          this.currentGeofences.forEach(element => {
            message += this.locations[element].id + " ";
          });
          console.log(message);
        }
        else {
          console.log("Current geofences je prazan");
          this.currentGeofences = new Set();
        }
      });
  }

  updatePosition() { 
    console.log("Updating position");
    let opt: GeolocationOptions = {timeout:5000, enableHighAccuracy: true};
    let watcher = this.geolocation.watchPosition(opt);

    watcher.subscribe((data) => {
      if (data.coords != undefined) {

        let currentLocation = new LatLng(data.coords.latitude, data.coords.longitude);  

        
        this.currrentCoords = currentLocation; 

        if (!this.mapDrag) {
          this.map.setCameraTarget(currentLocation);
        }
        this.intializeGeofences();
      }
    });  
    
  }

  loadMap() {      
      let option: MyLocationOptions = {
        enableHighAccuracy: true
      };
      
      this.geolocation.getCurrentPosition(option)
      .then((position) => {
        this.currrentCoords = new LatLng(position.coords.latitude, position.coords.longitude);
        alert("Current coords " + this.currrentCoords.lat + " " + this.currrentCoords.lng);
        let mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: position.coords.latitude, 
              lng: position.coords.longitude
            },
            zoom: 15,
            tilt: 20
          }
        };    
        
        this.map = GoogleMaps.create('map_canvas', mapOptions);

        this.map.on(GoogleMapsEvent.MAP_READY)
        .subscribe(() => {
          console.log("Map ready");
          this.map.setCompassEnabled(true);
          this.map.setMyLocationButtonEnabled(true);
          
          this.map.on(GoogleMapsEvent.MAP_DRAG_START)
          .subscribe(() => {
            this.mapDrag = true;
          });

          this.map.on(GoogleMapsEvent.MAP_DRAG_END)
          .subscribe(() => {
            this.mapDrag = false;
          });
          
          
          this.initializeMarkers();
          this.sortLocations();

          this.storage.get("currentGeofences")
          .then(value => {
              console.log("current geofences from memory: " + value);
              if (value == undefined) {
                this.locations.forEach((location, idx) => {
                  if (!this.setAnsweredQuestions.has(location.index) && idx < this.NUM_OF_CLOSEST) {
                    this.currentGeofences.add(location.index);
                    this.setGeofence(location.id, location.lat, location.lng, location.title, location.content, location.index);
                    // console.log("dodajem na " + location.index);
                  }
                });
              }
              else {
                this.currentGeofences = value;
              }

              this.updatePosition();
          });
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
      }).catch((err) => {
        alert(err.message);
      });
  }  

  intializeGeofences() {
    this.sortLocations();
    let setGeofenceHelper: Set<number> = new Set();

    let count = this.NUM_OF_CLOSEST;
    let cntNotAnswered = 0;

    for (let i = 0; i < this.locationsForSort.length; i++) {
      let index = this.locationsForSort[i].index;
      if (!this.setAnsweredQuestions.has(index)) {
        setGeofenceHelper.add(index);

        cntNotAnswered++;
        if (cntNotAnswered == this.NUM_OF_CLOSEST) {
          break;
        }

        if (this.currentGeofences.has(index)) {
          count--;
        }
      }
    }

    let arrGeofence = Array.from(setGeofenceHelper);

    // presek
    let intersect = new Set(arrGeofence.filter(x => this.currentGeofences.has(x)));


    /*
    let msg = "velicina seta intersect= "+intersect.size+"\npresek ona dva: ";
    if (intersect.size != 0 ) {
      intersect.forEach(el => {
        msg += el + " ";
      });
    }
    msg += "\nhelper:";
    if (setGeofenceHelper.size != 0 ) {
      setGeofenceHelper.forEach(el => {
        msg += el + " ";
      });
    }
    msg += "\ncurr:";
    if (this.currentGeofences.size != 0 ) {
      this.currentGeofences.forEach(el => {
        msg += el + " ";
      });
    }

    console.log(msg);
    */

    this.currentGeofences.forEach(idx => {
      if (!intersect.has(idx)) {
        this.geofence
          .remove(this.locations[idx].index + "")
          .then(() => {
            console.log("[init geo] Removed geofence from location " + this.locations[idx].index);
          });
      }
    });  

    setGeofenceHelper.forEach((el) => {
      if (!intersect.has(el)) {
        intersect.add(el);
      }
    });
    
    intersect.forEach(idx => {
      if (!this.currentGeofences.has(idx)) {
        this.setGeofence(this.locations[idx].id, 
          this.locations[idx].lat, 
          this.locations[idx].lng, 
          this.locations[idx].title, 
          this.locations[idx].content, 
          this.locations[idx].index);
      }
    });

    this.currentGeofences = intersect;
    this.storage.set("currentGeofences", this.currentGeofences)
      .then(() => {
        console.log("Upisao u memoriju current geofences");
      })
      .catch(() => {
        alert("Greska pri upisu current geofences");
      });
  }

  addMarker(index : any) {
    alert("About to add marker on location: " + this.locations[index].id);
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
      if (!this.setAnsweredQuestions.has(index)) {
        alert("Location not answered, setting geofence");
        this.setGeofence(this.locations[index].index + "", 
                          this.locations[index].lat, 
                          this.locations[index].lng, 
                          this.locations[index].title, 
                          "Ovo je lep muzej", 
                          index);
      }
    });
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km

    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  setGeofence(id:string, lat :number, lng:number, title : string, desc : string, idx : number) {
    // console.log("Ulazim u set geofence");
    let fence = {
      id : idx+"",
      latitude : lat, 
      longitude : lng, 
      radius : 100, 
      transitionType : 1,
      notification : {
        id : idx,
        title : "usao si u " + this.locations[idx].title,
        text : title,
        openAppOnClick : true
        
      }
    }

    this.geofence.addOrUpdate(fence).then(() => {
      console.log("[setGeofence] na lokaciji " + id);   
    }).catch((err) => {
      alert(err.message);
    });

    this.geofence.onTransitionReceived()
      .subscribe((geofnc) => {
        console.log("[transition recieved] objekat " + JSON.stringify(geofnc));
        geofnc.forEach(element => {
          this.resolvePending(element.id);
        });
      });

  }

  resolvePending(index) {
    const buttons = [{
      text: "Uzmi pitanje",
      handler : () => {
        this.storage.get("pendingQuestion")
        .then((value) => {
          if (value == undefined) {
            this.popUpQuestion(index, false);
          }
          else {
            this.pendingQuestion = value;
            this.popUpQuestion(index, true);
          }
        });
        }
     }, "Zatvori"];
    
    const options = {
      title: "Otkrivena lokacija",
      buttons: buttons,
      message : "Otkrili ste novu lokaciju vuuuhuuuu"
    };
    const alert = this.alertCtrl.create(options);
    alert.present();

  }

  popUpQuestion(index, hasPending: boolean) {
    let q;
    index = parseInt(index);
    if (!hasPending) {

      console.log("Izbacujem pitanje na lokaciji: " + this.locations[index].id);
      let questions: Question[] = this.locations[index].questions;
      let a = Math.floor((Math.random()*100)%questions.length);
      q = questions[a];
      this.storage.set("pendingQuestion", q)
        .then(() => {
          console.log("Setting pending question...");
        })
        .catch((reason) => {
          console.log("Error while setting pending question" + reason);
        });
    }
    else {
      q = this.pendingQuestion;
    }

    const buttons = [{
      text: "Odgovori",
      handler : (data) => {
        if(data == q.true) {
          this.vibration.vibrate([100, 300, 300, 100]);
          this.alertWrap("Tacan odgovor!!!");
          this.geofence
          .remove(this.locations[index].index + "")
          .then(() => {
            console.log("Skidam geofence sa lokacije " + this.locations[index].id + " jer tacno odgovorio na pitanje");
            this.setAnsweredQuestions.add(index);

            this.storage.set("setAnsweredQuestions", this.setAnsweredQuestions)
            .then(() => {
              console.log("Upisao skup odgovorenih u memoriju");
            });
          });
          this.storage.remove("pendingQuestion")
          .then(() => {
            console.log("Removed pending, answered true");
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
      subTitle: "Pitanje za lokaciju " + this.locations[index].id,
      buttons: buttons,
      inputs: inputs, 
      message : q.question
    };
    const alert = this.alertCtrl.create(options);
    alert.present();
  }

  clearStorage() {
    this.storage.ready()
    .then(() => {
      this.storage.remove("index")
      .then(() => {
        console.log("Removed index from local storage...");

        this.storage.remove("setAnsweredQuestions")
        .then(() => {
          console.log("Removed setAnsweredQuestions from storage...");

          this.storage.remove("currentGeofences")
          .then(() => {
            console.log("Removed currentGeofences from storage...");
          });
        });
      })
    }).catch(() => {
      alert("Storage not ready!");
    });
  }

  alertWrap(param) {
    alert(param);
  } 
}