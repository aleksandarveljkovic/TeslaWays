import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';


/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export enum ConnectionStatusEnum {
  Online,
  Offline
}

@Injectable()
export class NetworkProvider {

  previousStatus: any;

  constructor(public alertCtrl: AlertController,
              public network: Network,
              public eventCtrl: Events) {
    this.previousStatus = ConnectionStatusEnum.Online;
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus == ConnectionStatusEnum.Online) {
        this.eventCtrl.publish("network:offline");
      }
      this.previousStatus = ConnectionStatusEnum.Offline;
    });

    this.network.onConnect().subscribe(() => {
      if (this.previousStatus == ConnectionStatusEnum.Offline) {
        this.eventCtrl.publish("network:online");
      }
      this.previousStatus = ConnectionStatusEnum.Online;
    });
  }

}
