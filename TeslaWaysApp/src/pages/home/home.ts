import { NewsPage } from './../news/news';
import { NewsProvider } from './../../providers/news/news';
import { Tour } from './../../objekat/tura';
import { ObjectProvider } from './../../providers/object/object';
// import { GoogleMaps, GoogleMap, Environment, Marker, BaseArrayClass, MyLocationOptions, LocationService, MyLocation } from '@ionic-native/google-maps';

import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import 'leaflet-routing-machine';
import { GamePage } from '../game/game';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tours: any;
  news: any;
  helper: any;

  constructor(public navCtrl: NavController,
              public platform: Platform, 
              public objectProvider: ObjectProvider,
              public newsProvider: NewsProvider) {
    
  }

  ionViewDidLoad() {
    // this.news = this.newsService.getData();  
    this.tours = this.objectProvider.tours;
    alert(this.tours[0].tourTitle);
    let get = this.newsProvider.getData();
    get.subscribe((data) => {
      // alert("asdasdasd " + data.articles);
      this.news = data;
      
      this.helper = [this.news.articles[0], this.news.articles[1], this.news.articles[2]];
    });
  }
  startGame() {
    this.navCtrl.push(GamePage, {tours: this.tours});
  }

  openNewsPage() {
    this.navCtrl.push(NewsPage, {news: this.news});
  }

}


