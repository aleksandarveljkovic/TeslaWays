import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayNewsPage } from './display-news';

@NgModule({
  declarations: [
    DisplayNewsPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayNewsPage),
  ],
})
export class DisplayNewsPageModule {}
