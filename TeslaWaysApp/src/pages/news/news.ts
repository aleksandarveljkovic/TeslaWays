import { ObjectProvider } from './../../providers/object/object';
import { Article } from './../../article/article';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewsProvider } from '../../providers/news/news';
import { HttpClient } from '@angular/common/http';
import { DisplayNewsPage} from '../display-news/display-news';

// import { ImageLoader } from 'ionic-image-loader';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {

  data: any;
  images: any = [];
  object: any = {text: 'eeeeee'};
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private httpClient: HttpClient,
              public newsProvider: NewsProvider) {
    
  } 

  // TODO nemoj dva puta da ucitavas!!!!
  ionViewDidLoad() {
    if (this.navParams.get("news")) {
      this.data = this.navParams.get("news");
      alert(this.data);
    } 
    // else {
    //   this.newsProvider
    //   .getData()
    //   .subscribe((data) => {
    //     this.data = data;
    //   });
    // }  
  }

  initImages() {
    for (let article of this.data.articles) {
      this.images.push(article.urlToImg);
    }
  }

  displayArticle(article: string) {
    this.navCtrl.push(DisplayNewsPage, {article: article});
  }
}
