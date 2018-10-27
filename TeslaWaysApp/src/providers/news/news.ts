//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the NewsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
// API KEY for Newsapi.org: 9fb51fbb28fb479bac78f3b0b027914a
const API_URL = environment.apiUrl;
const API_KEY = environment.apiKey;

@Injectable()
export class NewsProvider {
  news : any;
  proba : Object = {tekst: "NEsto"};
  loaded: boolean = false;
  arr: any;
  
  constructor(public http: HttpClient) { 
  
  }

  getData(): Observable<any> {
    // alert("[get data] " + this.news);
    return this.http.get(`${API_URL}/top-headlines?country=us&category=business&apiKey=${API_KEY}`);
    // return this.proba;
  }
}
