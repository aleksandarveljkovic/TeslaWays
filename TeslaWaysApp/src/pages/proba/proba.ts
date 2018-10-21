import { NewsProvider } from './../../providers/news/news';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ImageLoader } from 'ionic-image-loader';
 
@Component({
  selector: 'page-proba',
  templateUrl: 'proba.html'
})
export class ProbaPage {
  users = [];
  jsonData = null;
  data: any = [];
 
  constructor(public navCtrl: NavController, private htppClient: HttpClient, private imageLoader: ImageLoader, private newsService: NewsProvider) { }
 
  loadData() {
    if (!this.jsonData) {
      this.newsService.getData('top-headlines?country=us&category=business').subscribe(res => {
        // this.users = res['results'];
        // this.jsonData = res['results'];
        console.log(res);
        this.data = res;
      });
    } else {
      this.users = [];
      setTimeout(() => {
        this.users = this.jsonData; 
      }, 1000);
    }
  }
 
  clearCache(refresher) {
    this.imageLoader.clearCache();
    refresher.complete();
  }
 
  onImageLoad(event) {
    console.log('image ready: ', event);
  }
}