import { NewsProvider } from './../providers/news/news';
import { TermsOfUsePage } from './../pages/terms-of-use/terms-of-use';
import { AboutProjectPage } from './../pages/about-project/about-project';
import { SightsPage } from './../pages/sights/sights';
import { NewsPage } from './../pages/news/news';
import { HomePage } from './../pages/home/home';
// import { ProbaPage } from './../pages/proba/proba';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  news: any;
  rootPageParams: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public newsProvider: NewsProvider,
              public events: Events,
              public network: Network,
              public networkProvider: NetworkProvider) {
    this.initializeApp();
    // platform.ready().then(() => {
      // newsPage.hello();
     // this.imageLoaderConfig.enableDebugMode();
      // this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      // this.imageLoaderConfig.setFallbackUrl('assets/imgs/logo.png');
      //this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);
      
      

      

      // ovo je bilo van
      this.pages = [
        ///DODATI SVE STRANICE KOJE PRAVIMO
        { title: 'Naslovna', component: HomePage },
        { title: 'Novosti', component: NewsPage},
        { title: 'Znamenitosti', component: SightsPage},
        { title: 'O projektu', component: AboutProjectPage},
        { title: 'Uslovi koriscenja', component: TermsOfUsePage},
      ];

      

      statusBar.styleDefault();
      splashScreen.hide();
    // });
    

    // this.imageLoaderConfig.enableDebugMode();
    // this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.newsProvider
        .getData()
        .subscribe((data) => {
          this.news = data;
          this.newsProvider.news = data;
          // this.rootPageParams = this.news;
          alert("[app component] loaded news! " + this.news);
          this.rootPage = HomePage;               
        });


      // this.networkProvider.initializeNetworkEvents();

      // this.events.subscribe("network:offline", () => {
      //   alert("Konekcija prekinuta... " + this.network.type);
      // });

      // this.events.subscribe("network:online", () => {
      //   alert("Konekcija online... " + this.network.type);
      // });


      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    if (page.component == NewsPage) {
      this.nav.push(page.component, {news: this.news});
    }
    else if (page.component == HomePage) {
      this.nav.popToRoot();
    }
    else {
      this.nav.push(page.component);
    }
  }
}
