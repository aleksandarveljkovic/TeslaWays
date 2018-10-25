import { NewsPage } from './../pages/news/news';
import { HomePage } from './../pages/home/home';
import { ProbaPage } from './../pages/proba/proba';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    platform.ready().then(() => {
      // newsPage.hello();
     // this.imageLoaderConfig.enableDebugMode();
      // this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      // this.imageLoaderConfig.setFallbackUrl('assets/imgs/logo.png');
      //this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);
      
      // ovo je bilo van
      this.pages = [
        ///DODATI SVE STRANICE KOJE PRAVIMO
        { title: 'Home', component: HomePage },
        { title: 'News', component: NewsPage},
        { title: 'Proba', component: ProbaPage},
        
      ];

      statusBar.styleDefault();
      splashScreen.hide();
    });
    

    // this.imageLoaderConfig.enableDebugMode();
    // this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);


    // used for an example of ngFor and navigation
    

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.rootPage = HomePage;
      // this.newsPage.hello();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
}
