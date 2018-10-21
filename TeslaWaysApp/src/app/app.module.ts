import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { CustomCardComponent } from '../components/custom-card/custom-card';
//  import { NativeLocator} from '../nativeLocator/nativeLocator';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewsPage,
    CustomCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewsPage,
    CustomCardComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NewsProvider,
    Geolocation
  ]
})
export class AppModule {}
