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


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  tours: any;
  news: any;
  helper: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform, 
              public objectProvider: ObjectProvider,
              public newsProvider: NewsProvider) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.tours = this.objectProvider.tours;
      this.news = this.newsProvider.news;
      alert("[home] " + this.news.articles[0].title);
      this.helper = [this.news.articles[0], this.news.articles[1], this.news.articles[2]];
    });
    

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

}


