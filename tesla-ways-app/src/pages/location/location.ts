import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Location } from '../../objekat/locations';

/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  data: Location;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get("location");

    console.log(this.data.id + ", " + this.data.title);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
  }

}
