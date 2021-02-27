import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FancySignalRService {

  private fancyConnection: any;
  private fancyProxy: any
  private fancyHubConn: any;

  private fancyHubAddress: any;

  private _fancyDataSub = new BehaviorSubject<any>(null);
  fancyData$: Observable<any> = this._fancyDataSub.asObservable();

  constructor() {
  }

  connectFancy(fancyHubAddress: string, matchid: number) {
    // console.log(this.fancyHubConn);
    // this.fancyHubAddress = fancyHubAddress;|
    this.fancyHubAddress="http://173.249.21.26:13921";

    // if(this.fancyHubConn==null){
    this.fancyConnection = (<any>$).hubConnection(this.fancyHubAddress);
    this.fancyProxy = this.fancyConnection.createHubProxy('FancyHub');

    this.fancyConnection.start().done((fancyHubConns: any) => {
      this.fancyHubConn = fancyHubConns;
      console.log("Fancy Hub Connection Established = " + fancyHubConns.state);
      // _.forEach(fancy, (item) => {
      this.fancyProxy.invoke('SubscribeFancy', matchid);
      // });
    }).fail((fancyHubErr: any) => {
      console.log("Could not connect Fancy Hub = " + fancyHubErr.state)
    })
    // }


    this.fancyConnection.stateChanged((change: any) => {
      if (change.newState === 4 && this.fancyHubConn != null && this.fancyHubAddress != null) {
        this.fancyConnection.start().done((fancyHubConns: any) => {
          this.fancyHubConn = fancyHubConns;
          console.log("Fancy Hub Reconnection Established = " + fancyHubConns.state);
          this.fancyProxy.invoke('SubscribeFancy', matchid);
        }).fail((fancyHubErr: any) => {
          console.log("Could not Reconnect Fancy Hub = " + fancyHubErr.state)
        })
      }
    })


    this.fancyProxy.on("BroadcastSubscribedData", (fancy: any) => {
      // console.log(fancy);
      this._fancyDataSub.next(fancy);
    })
  }

  UnsuscribeFancy(matchId: string) {
    if (!this.fancyHubConn) {
      return;
    }
    if (this.fancyHubConn.state == 1) {
      this.fancyHubAddress = null;
      this.fancyProxy.invoke('UnsubscribeFancy', matchId);
      console.log("Unsubscribe fancy for: ", matchId);
      this.fancyConnection.stop();
      this.fancyHubConn = null;
      this.fancyConnection = null;
      this.fancyProxy = null;
      this._fancyDataSub.next(null);
    }
  }
}
