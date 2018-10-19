//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

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

  // constructor(public http: HttpClient) {
    constructor(public http: HttpClient) {
    console.log('Hello NewsProvider Provider');
  }

  getData(url) {
    return this.http.get(`${API_URL}/${url}&apiKey=${API_KEY}`);
  }

}
