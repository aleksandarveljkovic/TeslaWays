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
    {id: 0, question: "Ko je najjaci", answers: ["Andrija","Dimitrije"], true: "Andrija"},
    {id: 1, question: "Ko je najjaciiii", answers: ["Andrija","Dimitrije"], true: "Dimitrije"},
  ];

  // Testiranje oko faksa
  locations : Location[] = [
    {
      id: "test oko faksa",
      index: 0,
      adress: "Studentski trg 16",
      lat: 44.820119,  
      lng:  20.459144,
      title : "test oko faksa", // naziv lokacije
      content : "Nestoooooooo",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "test desno od passengersa",
      index: 1,
      adress: "adresa",
      lat: 44.820715, 
      lng: 20.458832,
      title : "test desno od passengersa", // naziv lokacije
      content : "neki sadrzaj lokacije",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "iznad parka",
      index: 2,
      adress: "neka adresa bla bka",
      lat: 44.818904, 
      lng: 20.457434,
      title : "iznad parka", // naziv lokacije
      content : "DSA",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "Bezanijska kosa geofence test",
      index: 3,
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
  // Tesiranje Bezanija
  bezanijskaKosaLocations : Location[] = [
    {
      id: "test 0",
      index: 0,
      adress: "asd",
      lat: 44.811000,  
      lng:  20.367073,
      title : "Title test 0", // naziv lokacije
      content : "Nestoooooooo",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "test 1",
      index: 1,
      adress: "adresa",
      lat: 44.809858, 
      lng:  20.366864,
      title : "Title test 1", // naziv lokacije
      content : "neki sadrzaj lokacije",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "test 2",
      index: 2,
      adress: "adresaasdasd",
      lat: 44.809517,
      lng: 20.366628,
      title : "tTitle test 2", // naziv lokacije
      content : "DSA",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    }
  ];
  // Testiranje Banja
  visnjickaBanjaLocations : Location[] = [
    {
      id: "za izbacivanje",
      index: 0,
      adress: "asd",
      lat: 44.817665,    
      lng:  20.531446,
      title : "za izbacivanje", // naziv lokacije
      content : "Nestoooooooo",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "Aroma",
      index: 1,
      adress: "adresa",
      lat: 44.816440, 
      lng:  20.532479,
      title : "Aroma", // naziv lokacije
      content : "neki sadrzaj lokacije",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "Panter",
      index: 2,
      adress: "adresaasdasd",
      lat: 44.815866, 
      lng: 20.532218,
      title : "Panter", // naziv lokacije
      content : "DSA",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    },
    {
      id: "Vrtic",
      index: 3,
      adress: "adresaasdasd",
      lat: 44.815918,  
      lng: 20.534989,
      title : "Vrtic", // naziv lokacije
      content : "DSA",
      urlToImg: "https://www.w3schools.com/w3css/img_lights.jpg",
      questions: this.questions,
      status: "discovered", // locked, undiscovered, answered
      answered: false
    }
  ];

  
  tours : Tour = 
    {tourTitle: "Teslin put kroz Beograd", locations: this.locations};

  getData(url): Tour {
    // return this.http.get("/dajObjekat"); //ovde url kad dignem na localhost
    return this.tours;
  }
}
