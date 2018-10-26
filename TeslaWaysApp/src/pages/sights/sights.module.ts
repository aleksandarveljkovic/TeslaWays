import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SightsPage } from './sights';

@NgModule({
  declarations: [
    SightsPage,
  ],
  imports: [
    IonicPageModule.forChild(SightsPage),
  ],
})
export class SightsPageModule {}
