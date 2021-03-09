import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HomeMarket } from '../../models/home-market';

@Injectable({
  providedIn: 'root'
})
export class MatchOddsSignalRService {

  private marketConnection: any;
  private marketProxy: any;
  private marketHubConn: any;

  private marketHubAddress: any;

  private _marketsData = new BehaviorSubject<any>(null);
  marketsData$ = this._marketsData.asObservable();

  private _marketErrSource= new BehaviorSubject<any>(null);
  currentMarketErr$=this._marketErrSource.asObservable();

  constructor() {
  }

  connectMarket(marketHubAddress: any, markets: HomeMarket[]) {
    this.marketHubAddress = marketHubAddress;

    this.marketConnection = (<any>$).hubConnection(this.marketHubAddress);
    this.marketProxy = this.marketConnection.createHubProxy("RunnersHub");

    this.marketConnection.start().done((marketHubConns: any) => {
      this.marketHubConn = marketHubConns;
      console.log("Market Hub Connection Established = " + marketHubConns.state);
      markets.forEach((market) => {
        this.marketProxy.invoke('SubscribeMarket', market.bfId);
      });
    }).fail((marketHubErr: any) => {
      console.log("Could not connect Market Hub = " + marketHubErr.state)
    })

    this.marketConnection.stateChanged((change: any) => {
      if (change.newState === 4 && this.marketHubConn != null && this.marketHubAddress != null) {
        this.marketConnection.start().done((marketHubConns: any) => {
          this.marketHubConn = marketHubConns;
          console.log("Market Hub Reconnection Established = " + marketHubConns.state);
          markets.forEach((market) => {
            this.marketProxy.invoke('SubscribeMarket', market.bfId);
          });
        }).fail((marketHubErr: any) => {
          console.log("Could not Reconnect Market Hub = " + marketHubErr.state)
        })
      }
    })

    this.marketProxy.on("BroadcastSubscribedData", (runner: any) => {
      // console.log(runner);
      this._marketsData.next(runner);
    })
  }


  UnsuscribeMarkets(markets: HomeMarket[]) {
    if (!this.marketHubConn) {
      return;
    }
    if (this.marketHubConn.state == 1) {
      this.marketHubAddress = null;
      markets.forEach((market) => {
        this.marketProxy.invoke('UnsubscribeMarket', market.bfId);
        console.log("Unsubscribe match odds for: ", market.bfId);
      });
      this.marketConnection.stop();
      this.marketHubConn = null;
      this.marketConnection = null;
      this.marketProxy = null;
      this._marketsData.next(null);
    }
  }

  UnsuscribeSingleMarket(bfId: string) {
    if (!this.marketHubConn) {
      return;
    }
    if (this.marketHubConn.state == 1) {
      this.marketProxy.invoke('UnsubscribeMarket', bfId);
    }
  }
}
