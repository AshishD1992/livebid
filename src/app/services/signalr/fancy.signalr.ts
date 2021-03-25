import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import _ from 'lodash';
import { hubConnection } from 'signalr-no-jquery';

@Injectable({
  providedIn: 'root'
})
export class FancyService {

  private fancyConnection;
  private fancyProxy;
  private fancyHubConn;

  private fancyHubAddress;

  fancySource: Observable<any>;
  private currentFancy: BehaviorSubject<any>;

  constructor() {
    this.currentFancy = <BehaviorSubject<any>>new BehaviorSubject(null);
    this.fancySource = this.currentFancy.asObservable();
  }

  connectFancy(fancyHubAddress, fancy) {
    this.fancyHubAddress = "http://207.180.220.254:12611";

    // if(this.fancyHubConn==null){
      this.fancyConnection = hubConnection(this.fancyHubAddress);
      this.fancyProxy = this.fancyConnection.createHubProxy("FancyHub");

      this.fancyConnection.start().done((fancyHubConns) => {
        this.fancyHubConn = fancyHubConns;
        console.log("Fancy Hub Connection Established = " + fancyHubConns.state);
        _.forEach(fancy, (item) => {
          this.fancyProxy.invoke('SubscribeFancy', item.id);
        });
      }).fail((fancyHubErr) => {
        console.log("Could not connect Fancy Hub = " + fancyHubErr.state)
      })
    // }



    this.fancyProxy.on("BroadcastSubscribedData", (fancy) => {
      // console.log(fancy);
      this.currentFancy.next(fancy);
    })
  }

  UnsuscribeFancy(fancy) {
    if(!this.fancyHubConn){
      return;
    }
    if (this.fancyHubConn.state == 1) {
      _.forEach(fancy, (item) => {
        this.fancyProxy.invoke('UnsubscribeFancy', item.id);
      });
      this.fancyConnection.stop();
      this.fancyHubConn=null;
      this.fancyConnection=null;
      this.fancyProxy=null;
      this.currentFancy.next(null);
    }
  }

  UnsuscribeSingleFancy(matchId) {
    if(!this.fancyHubConn){
      return;
    }
    if (this.fancyHubConn.state == 1) {
        this.fancyProxy.invoke('UnsubscribeFancy', matchId);
    }
  }
}
