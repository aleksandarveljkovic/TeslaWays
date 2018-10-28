import { Location } from './../../objekat/locations';
import { Question } from './../../objekat/question';
import { Tour } from './../../objekat/tura';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ObjectProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ObjectProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ObjectProvider Provider');
  }

  questions : Question[] = [
    {id: 1, question: "Ko je najjaci", answers: ["Andria","Dimitrije"], true: "Andria"},
    {id: 2, question: "Ko je najjaciiii", answers: ["Andria","Dimitrije"], true: "Dimitrije"},
  ];

  locations : Location[] = [
    {
      id: "nekaLokacija",
      index: 0,
      adress: "adresa",
      lat: 44.818137,
      lng: 20.456649,
      title : "Lokacija 1", // naziv lokacije
      content : "DSA",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "nekaDruga",
      index: 1,
      adress: "adresaasdasd",
      lat: 44.816496,
      lng: 20.456625,
      title : "Lokacija 2", // naziv lokacije
      content : "DSA",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "Lokacija Bezanijska kosa geofence test",
      index: 2,
      adress: "adresaasdasd",
      lat: 44.809517,
      lng: 20.366628,
      title : "Lokacija 2", // naziv lokacije
      content : "DSA",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    }
    
  ];
  
  tours : Tour[] = [
    {tourTitle: "Teslin put kroz Beograd", locations: this.locations}
  ];

  getData(url): Tour[] {
    // return this.http.get("/dajObjekat"); //ovde url kad dignem na localhost
    return this.tours;
  }
}
