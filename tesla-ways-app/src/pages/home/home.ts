import { DisplayNewsPage } from './../display-news/display-news';
import { MyApp } from './../../app/app.component';
import { NewsPage } from './../news/news';
import { NewsProvider } from './../../providers/news/news';
import { Tour } from './../../objekat/tura';
import { ObjectProvider } from './../../providers/object/object';
// import { GoogleMaps, GoogleMap, Environment, Marker, BaseArrayClass, MyLocationOptions, LocationService, MyLocation } from '@ionic-native/google-maps';

import { Component, Input } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import 'leaflet-routing-machine';
import { GamePage } from '../game/game';

import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  tours: Tour;
  news: any;
  helper: any;
  random : number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform, 
              public objectProvider: ObjectProvider,
              public newsProvider: NewsProvider,
              private storage : Storage) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.tours = this.objectProvider.tours;
      this.news = this.newsProvider.news;
      this.helper = [this.news.articles[0], this.news.articles[1], this.news.articles[2]];
    });
    

  }

  checkForObject(): boolean {
    if (this.tours.tourTitle != undefined) {
      return true;
    }
    return false;
  }

  startGame() {
    this.navCtrl.push(GamePage, {tours: this.tours});
  }

  openNewsPage() {
    this.navCtrl.push(NewsPage, {news: this.news});
  }

  displayArticle(article: string) {
    this.navCtrl.push(DisplayNewsPage, {article: article});
  }

  doRefresh(refresher) {
    console.log("Refreshing... send http req");

    this.news = this.newsProvider.news;

    console.log("Gotovo");
    refresher.complete();
  }
  
}


