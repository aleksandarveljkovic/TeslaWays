import { SelfiePage } from './../pages/selfie/selfie';
import { Vibration } from '@ionic-native/vibration';
import { Network } from '@ionic-native/network';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { NetworkProvider } from './../providers/network/network';
import { SightsPage } from './../pages/sights/sights';
import { TermsOfUsePage } from './../pages/terms-of-use/terms-of-use';
import { AboutProjectPage } from './../pages/about-project/about-project';
import { GamePage } from './../pages/game/game';
import { DisplayNewsPage } from './../pages/display-news/display-news';
import { HttpClientModule } from '@angular/common/http';
import { NewsPage } from './../pages/news/news';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

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
import { LocationPage } from '../pages/location/location';

import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewsPage,
    DisplayNewsPage, 
    GamePage,
    AboutProjectPage,
    TermsOfUsePage,
    SightsPage,
    LocationPage,
    SelfiePage
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
    SightsPage,
    LocationPage,
    SelfiePage
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
    LocationAccuracy,
    Geofence,
    NetworkProvider,
    CameraPreview
  ]
})
export class AppModule {}
