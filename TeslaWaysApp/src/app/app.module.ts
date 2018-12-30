import { Vibration } from '@ionic-native/vibration';
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

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewsProvider } from '../providers/news/news';
import { Geolocation } from '@ionic-native/geolocation';
import {GoogleMaps} from "@ionic-native/google-maps";
import {Geofence} from "@ionic-native/geofence"
import { ObjectProvider } from '../providers/object/object';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewsPage,
    DisplayNewsPage, 
    GamePage,
    AboutProjectPage,
    TermsOfUsePage,
    SightsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
        driverOrder:['indexeddb', 'sqlite', 'websql']
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewsPage,
    DisplayNewsPage,
    GamePage,
    AboutProjectPage,
    TermsOfUsePage,
    SightsPage
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
    Geolocation, 
    Vibration,
    Geofence,
    NetworkProvider
  ]
})
export class AppModule {}
