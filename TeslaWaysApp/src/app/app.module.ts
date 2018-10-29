import { Network } from '@ionic-native/network';
import { NetworkProvider } from './../providers/network/network';
import { SightsPage } from './../pages/sights/sights';
import { TermsOfUsePage } from './../pages/terms-of-use/terms-of-use';
import { AboutProjectPage } from './../pages/about-project/about-project';
import { GamePage } from './../pages/game/game';
import { DisplayNewsPage } from './../pages/display-news/display-news';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NewsPage } from './../pages/news/news';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Events } from 'ionic-angular';
//import { IonicImageLoader } from 'ionic-image-loader';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewsProvider } from '../providers/news/news';
import { Geolocation } from '@ionic-native/geolocation';
// import { CustomCardComponent } from '../components/custom-card/custom-card';
// import { ProbaPage } from '../pages/proba/proba';

import {GoogleMaps} from "@ionic-native/google-maps";
import {Geofence} from "@ionic-native/geofence"
import { ObjectProvider } from '../providers/object/object';

import { IonicStorageModule } from '@ionic/storage';

//  import { NativeLocator} from '../nativeLocator/nativeLocator';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewsPage,
    // ProbaPage,
    DisplayNewsPage, 
    GamePage,
    AboutProjectPage,
    TermsOfUsePage,
    SightsPage
    // CustomCardComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
        driverOrder:['indexeddb', 'sqlite', 'websql']
    })
    //IonicImageLoader.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewsPage,
    // ProbaPage,
    DisplayNewsPage,
    GamePage,
    AboutProjectPage,
    TermsOfUsePage,
    SightsPage
    // CustomCardComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GoogleMaps,
    ObjectProvider,
    NewsProvider,
    NetworkProvider,
    Network,    
    // LocationService,
    Geolocation, 
    Geofence,
    NetworkProvider
  ]
})
export class AppModule {}
