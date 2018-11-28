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
  endGameAlert = this.alertCtrl.create({
    title: 'VUUUUHUUUU',
    subTitle: 'Ti si ultra car i odgovorio si sva pitanja zavrsio rutu itd itd :)',
    buttons: ['Zatvori']
  });
  gameFinished: boolean = false;



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
      // alert("Platform ready!!!");

      this.geofence.initialize().then(() => {
        alert('geofence ready');
        
      });
    
      // JOS SE POIGRAJ KAD JE IGRA ZAVRSENA STA SE DESAVA
      this.storage.ready().then(() => {
        alert("Storage ready!")
        
        this.storage.get("gameFinished")
          .then((value) => {
            this.gameFinished = value == undefined ? false : true;

            this.loadSetAnswered();
            this.tours = this.navParams.get('tours');
            this.locations = this.tours.locations;
            
            // Ovde ce se za svaki i dodati geofence jer ga nema u skupu odgovorenih lokacija
            // Treba da se izmeni tako da se postavlja samo na pet najblizih jer je ograncienje 20...
            // PAZI NA OVO!!!
            // for (let i = 0; i < this.locations.length; i++) {
            //   this.addMarker(this.locations[i].index);
            // }
          });
      });
        

        // this.sortLocations();

        // this.locations.forEach(loc => {
        //   alert(loc.index);
        // });
  
        this.loadMap();
      
    }).catch((err) => {
      alert(err);
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

  updatePosition() { 
    let watcher = this.geolocation.watchPosition();

    setTimeout(() => {
      watcher.subscribe((data) => {
        let currentLocation = new LatLng(data.coords.latitude, data.coords.longitude);  
        this.currrentCoords = currentLocation; 
        this.map.setCameraTarget(currentLocation);
      });  
    }, 2000);
    
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
        alert("Current index from local storage: " + this.currentLocationIndex + "\nAbout to setCurrentState()");

        this.setCurrentState();       
      });

              
      }).catch((err) => {
        alert(err.message);
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

  sortLocations() {
    this.locations.sort((a, b):number => {
      if (this.distance(a) < this.distance(b)) {
        return -1;
      }
      else {
        return 1;
      }
    });
  }

  distance(locationPosition: Location): number {
    let dist = Math.sqrt(Math.pow(this.currrentCoords.lat - locationPosition.lat, 2) 
                        - Math.pow(this.currrentCoords.lng - locationPosition.lng, 2));
    
    return dist;
  }

  setCurrentState() {
    if (this.currentLocationIndex == undefined) {
      alert("In current state, index from memory is null");
      // this.sortLocations();

      // this.locations.forEach(loc => {
      //     alert(loc.index);
      //   });

      this.currentLocationIndex = this.locations[0].index; // Biram najblizu
      alert("Posto nisam nasao biram indeks: " + this.currentLocationIndex);
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
    alert(id + " " +lat + " " +lng + " " +title  + " " +desc + " " +idx);
    let fence = {
      id : id,
      latitude : lat, 
      longitude : lng, 
      radius : 500, 
      transitionType : 1,
      notification : {
        id : idx,
        title : "usao si u fence " + idx + " na lokaciji " + id,
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
        this.alertWrap("Usao u geofence " + id + " sa indeksom " + idx);
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

  wrapper() {
    alert("Tacan odgovor juuuhuuuu :)");

    this.currentLocationIndex++;
    this.storage
      .set("index", this.currentLocationIndex)
      .then(() => {
        this.setCurrentState();
      });
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
            alert("Removed index...");
          })
          .catch(() => {
            alert("There's no index to remove :)");
          });
        this.storage.remove("setAnsweredQuestions")
          .then(() => {
            alert("Removed set...");
          })
          .catch(() => {
            alert("No set to be removed");
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
