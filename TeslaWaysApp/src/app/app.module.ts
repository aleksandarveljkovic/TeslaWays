import { DisplayNewsPage } from './../pages/display-news/display-news';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NewsPage } from './../pages/news/news';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
//import { IonicImageLoader } from 'ionic-image-loader';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewsProvider } from '../providers/news/news';
import { Geolocation } from '@ionic-native/geolocation';
import { CustomCardComponent } from '../components/custom-card/custom-card';
import { ProbaPage } from '../pages/proba/proba';

import {GoogleMaps} from "@ionic-native/google-maps";

//  import { NativeLocator} from '../nativeLocator/nativeLocator';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewsPage,
    ProbaPage,
    DisplayNewsPage, 
    CustomCardComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    //IonicImageLoader.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewsPage,
    ProbaPage,
    DisplayNewsPage,
    CustomCardComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NewsProvider,
    GoogleMaps,
    Geolocation
  ]
})
export class AppModule {}
