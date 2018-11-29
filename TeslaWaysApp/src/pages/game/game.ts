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
import { Location } from '../../objekat/locations';



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

  tours: Tour;
  locations: Location[];
  currentGeofenceTriggered: any;
  answeredLocations: number[]; // Niz indeksa lokacija koje su odgovorene tacno
  currrentCoords: LatLng;
  setAnsweredQuestions: Set<number> = new Set();

  currentGeofences: Set<number> = new Set();

  endGameAlert = this.alertCtrl.create({
    title: 'VUUUUHUUUU',
    subTitle: 'Ti si ultra car i odgovorio si sva pitanja zavrsio rutu itd itd :)',
    buttons: ['Zatvori']
  });

  gameFinished: boolean = false;

  NUM_OF_CLOSEST: number = 2;

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
      // this.updatePosition();
    });
  }

  

  ionViewDidLoad() {
    this.platform.ready().then(() => {

      this.geofence.initialize().then(() => {
        // alert('geofence ready');
        
      });
    
      // JOS SE POIGRAJ KAD JE IGRA ZAVRSENA STA SE DESAVA
      this.storage.ready().then(() => {
        // alert("Storage ready!")
        
        this.storage.get("gameFinished")
          .then((value) => {
            this.gameFinished = value == undefined ? false : true;

            this.loadSetAnswered();
            this.tours = this.navParams.get('tours');
            this.locations = this.tours.locations;
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
        zoom : 18
        
      }).then((marker : Marker) => {
        
        // alert("Init marker id: " + marker.getId());
        // this.getDistanceFromLatLonInKm(this.currrentCoords.lat, this.currrentCoords.lng, location.lat, location.lng);
      });
    });
  }

  sortLocations() {
    const myLat = this.currrentCoords.lat;
    const myLng = this.currrentCoords.lng;

    this.locations.sort((a, b) => {
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
          alert("Answered questions are empty");
          this.setAnsweredQuestions = new Set();
        }
        else {
          this.setAnsweredQuestions = value;

          let message = "Answered locations: ";
          this.setAnsweredQuestions.forEach(element => {
            message += element + " "
          });

          alert(message);
        }
      });
  }

  lokacije = [{lat: 44.817800, lng: 20.531600}, {lat: 44.815981, lng: 20.532315}];
  glupBrojac = 0;
  updatePosition() { 
    let watcher = this.geolocation.watchPosition();

    watcher.subscribe((data) => {
      let currentLocation = new LatLng(data.coords.latitude, data.coords.longitude);  
      this.currrentCoords = currentLocation; 
      // let currentLocation = new LatLng(this.lokacije[this.glupBrojac%2].lat,this.lokacije[this.glupBrojac%2].lng)
      // this.currrentCoords = new LatLng(this.lokacije[this.glupBrojac%2].lat,this.lokacije[this.glupBrojac%2].lng);
      // this.glupBrojac++;
      this.map.setCameraTarget(currentLocation);
      this.intializeGeofences();
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
        // alert("current location via native geolocation: " + position.coords.latitude + " " + position.coords.longitude);
        this.currrentCoords = new LatLng(position.coords.latitude, position.coords.longitude);
        alert("Current coords " + this.currrentCoords.lat + " " + this.currrentCoords.lng);
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
            // alert("MAP READY triggered!");
            this.initializeMarkers();
            // this.intializeGeofences();
            this.sortLocations();

            this.storage.get("currentGeofences")
              .then(value => {
                if (value == undefined) {
                  this.locations.forEach((location, idx) => {
                    if (!this.setAnsweredQuestions.has(location.index) && idx < this.NUM_OF_CLOSEST) {
                      this.currentGeofences.add(location.index);
                      this.setGeofence(location.id, 
                        location.lat, 
                        location.lng, 
                        location.title, 
                        location.content, 
                        location.index);
                      alert("dodajem na " + location.index);
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


      const currInd = this.getCurrentObjectFromStorage();
      currInd.then((val) => {
        this.currentLocationIndex = val;  
        // alert("Current index from local storage: " + this.currentLocationIndex + "\nAbout to setCurrentState()");

        // this.setCurrentState();       
      });

              
      }).catch((err) => {
        alert(err.message);
      });
  }  

  



  // OVDE SMO BATO NAJJACI
  intializeGeofences() {
    // alert("About to initialize geofence");
    this.sortLocations();
    let setGeofenceHelper: Set<number> = new Set();

    let count = this.NUM_OF_CLOSEST;
    let cntNotAnswered = 0;

    for (let i = 0; i < this.locations.length; i++) {
      let index = this.locations[i].index;
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


    let msg = "velicina seta= "+intersect.size+"\npresek ona dva: ";
    if (intersect.size != 0 ) {
      intersect.forEach(el => {
        msg += el + " ";
      });
    }
    msg += "\n";
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

    alert(msg);

    for (let i = 0; i < this.locations.length; i++) {
      let index = this.locations[i].index;
      if (intersect.size == this.NUM_OF_CLOSEST) {
        break;
      }

      if (!this.setAnsweredQuestions.has(index) && !intersect.has(index)) {
        intersect.add(index);
      }
    }

    this.currentGeofences.forEach(idx => {
      if (!intersect.has(idx)) {
        this.locations.forEach((loc) => {
          if (loc.index == idx) {
            // alert("Treba da skinem sa " + loc.title + " \nima indeks "+loc.index);
            this.geofence
              .remove(loc.index + "")
              .then(() => {
                this.alertWrap("[init geo] Removed geofence from location " + loc.index);
                loc.answered = true;
            });
          }
        });
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
        // alert("Upisao u memoriju current geofences");
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

    // alert("distance for this point: " + d);
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  setCurrentState() {
    if (this.currentLocationIndex == undefined) {
      // alert("In current state, index from memory is null");
      // this.sortLocations();

      // this.locations.forEach(loc => {
      //     alert(loc.index);
      //   });

      this.currentLocationIndex = this.locations[0].index; // Biram najblizu
      // alert("Posto nisam nasao biram indeks: " + this.currentLocationIndex);
      this.addMarker(this.currentLocationIndex);
    }
    else {
      this.setAnsweredQuestions.forEach((index) => {
        alert("Stavljam marker na odgovorenu lokaciju");
        // alert("Stavljam marker na odgovorenu lokaciju sa indeksom " + index);
        this.addMarker(index);
      });
      const nextLocation = this.locations[this.currentLocationIndex];
      if (!this.setAnsweredQuestions.has(nextLocation.index)) {
        alert("Setting geofence on next location " + nextLocation.id + " idx:" + nextLocation.index);
        this.setGeofence(nextLocation.id, nextLocation.lat, nextLocation.lng, nextLocation.title, nextLocation.content, nextLocation.index);
      }
    }
  }


  setGeofence(id:string, lat :number, lng:number, title : string, desc : string, idx : number) {
    // alert(id + " " +lat + " " +lng + " " +title  + " " +desc + " " +idx);
    let fence = {
      id : id,
      latitude : lat, 
      longitude : lng, 
      radius : 150, 
      transitionType : 1,
      notification : {
        id : idx,
        title : "usao si u fence " + idx + " na lokaciji " + id,
        text : title,
        openAppOnClick : true

      }
    }

    this.geofence.addOrUpdate(fence).then(() => {
      // alert("E bato evo geofence-a :) na lokaciji " + id);   
    }).catch((err) => {
      alert(err.message);
    });

    this.geofence.onTransitionReceived()
      .subscribe(() => {
        this.alertWrap("Usao u geofence " + id + " sa indeksom " + idx);
        // this.popUpQuestion();
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
              // this.wrapper();
              this.setMemoryState();
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

  allAnswered(): boolean {
    return this.setAnsweredQuestions.size == this.locations.length;
  }

  setMemoryState() {
    alert("Tacan odgovor! juhuuuuuuuuu");
    this.setAnsweredQuestions.add(this.currentLocationIndex);
    this.locations[this.currentLocationIndex].answered = true;

    if (this.allAnswered()) {
      this.endGameAlert.present();
      this.gameFinished = true;

      this.storage.set("setAnsweredQuestions", this.setAnsweredQuestions)
        .then(() => {
          this.alertWrap("Updating answered q for the last time :)");
        });

      this.storage.set("gameFinished", this.gameFinished)
        .then(() => {
          this.alertWrap("Game finished written to memory")
        });
      
    }
    else {
      for (let i = 0; i < this.locations.length; i++) {
        if (!this.setAnsweredQuestions.has(this.locations[i].index)) {
          this.currentLocationIndex = this.locations[i].index;
          break;
        }
      }
  
      alert("I upisujem indeks sledece lokacije u memoriju: " + this.currentLocationIndex);
      this.storage
        .set("setAnsweredQuestions", this.setAnsweredQuestions)
        .then(() => {
          alert("Updated set containing ans q");

          this.storage
            .set("index", this.currentLocationIndex)
            .then(() => {
              this.setCurrentState();
         });
       });      
    }
    // this.sortLocations();

    
    // this.locations[this.currentLocationIndex].answered = true;
    // let a = Math.floor((Math.random()*100)%this.locations[this.currentLocationIndex].questions.length);
    // this.currentLocationIndex++; // curr=sortirani indeksi od 0 
    // this.storage
    //   .set("question", this.locations[this.currentLocationIndex].questions[a])
    //   .then(() => {
    //     alert("Upisao objekat");
    //     this.setCurrentState();
    //   });
  }

  clearStorage() {
    this.storage.ready()
      .then(() => {
        this.storage.remove("index")
          .then(() => {
            // alert("Removed index...");
          })
          .catch(() => {
            alert("There's no index to remove :)");
          });
        this.storage.remove("setAnsweredQuestions")
          .then(() => {
            // alert("Removed set...");

            this.storage.remove("currentGeofences")
            .then(() => {
              // alert("Removed set...");
            })
            .catch(() => {
              // alert("No set to be removed");
            });
          })
          .catch(() => {
            alert("No set to be removed");
          });

      });
  }

  alertWrap(param) {
    alert(param);
  } 
}