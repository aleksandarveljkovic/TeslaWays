import { Article } from './../../article/article';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewsProvider } from '../../providers/news/news';
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
export class NewsPage implements OnInit {

  data: any = [];
  images: any = [];
  object: any = {text: 'eeeeee'};
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private newsService: NewsProvider) {
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
  }

  ngOnInit() {
    this.newsService
      .getData('top-headlines?country=us&category=business')
      .subscribe((data) => {
        console.log(data);
        this.data = data;
        // this.initImages();
        // console.log(this.data.articles.author);

    });
  }

  initImages() {
    for (let article of this.data.articles) {
      this.images.push(article.urlToImg);
    }
  }
}
