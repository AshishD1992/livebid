import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TpMarket } from '../../models/tpmarket.model'
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class TeenpattiSignalRService {

  private TeenPattiHubAddress: any;
  private TeenPattiConnection: any
  private Teentype: any;
  private teenPattiData: any;
  private TeenPattiProxy: any;
  private tpData: any;
  private tpMarket!: TpMarket[];
  private openCards: any;
  hubConState: any;
  AndarValues: any = []
  BaharValues: any = []
  Aallcards = [];
  Ballcards = [];
  Aresults = [];
  Bresults = [];
  private _TeenPattiData = new BehaviorSubject<any>(null);
  TeenPattiData$: Observable<any> = this._TeenPattiData.asObservable();

  private _TPMarketData = new BehaviorSubject<any>(null);
  TPMarketData$: Observable<any> = this._TPMarketData.asObservable();

  private _AallcardsData = new BehaviorSubject<any>(null);
  AallcardsData$: Observable<any> = this._AallcardsData.asObservable();

  private _BallcardsData = new BehaviorSubject<any>(null);
  BallcardsData$: Observable<any> = this._BallcardsData.asObservable();

  private _AresultsData = new BehaviorSubject<any>(null);
  AresultsData$: Observable<any> = this._AresultsData.asObservable();

  private _BresultsData = new BehaviorSubject<any>(null);
  BresultsData$: Observable<any> = this._BresultsData.asObservable();

  private _TeentypeData = new BehaviorSubject<any>(null);
  TeentypeData$: Observable<any> = this._TeentypeData.asObservable();

  TeenPattiSignalr(teenBfId: any) {
    //Getting the connection object
    if (teenBfId == "5000") {
      this.TeenPattiHubAddress = "http://45.76.155.250:11001";
      this.Teentype = 1;

    } else if (teenBfId == "5001") {
      this.TeenPattiHubAddress = "http://45.76.155.250:11002";
      this.Teentype = 2;
    } else if (teenBfId == "5003") {
      this.TeenPattiHubAddress = "http://45.76.155.250:11005";
      this.Teentype = 5;

    } else if (teenBfId == "5004") {
      this.TeenPattiHubAddress = "http://45.76.155.250:11006";
      this.Teentype = 6;

    } else if (teenBfId == "5005") {
      this.TeenPattiHubAddress = "http://45.76.155.250:11007";
      this.Teentype = 7;

    }

    this.TeenPattiConnection = (<any>$).hubConnection(this.TeenPattiHubAddress);
    //Creating Proxy
    this.TeenPattiProxy = this.TeenPattiConnection.createHubProxy(
      "FancyHub"
    );
    //Starting connection
    this.TeenPattiConnection.start()
      .done((myHubConnection: any) => {
        this.hubConState = myHubConnection;
        console.log("TeenPatti Connection Established= " + this.hubConState.state);

      })
      .fail((myHubConnection: any) => {
        this.hubConState = myHubConnection;
        console.log("Could not connect= " + this.hubConState);
      });
    this.TeenPattiConnection.stateChanged((change: any) => {
      // console.log(change.newState)
      if (change.newState != 1 && this.TeenPattiHubAddress) {
        this.TeenPattiConnection.start().done((myHubConnection: any) => {
          this.hubConState = myHubConnection;
          console.log("TeenPatti ReConnection Established = " + this.hubConState.state);
        });
      }
      if (
        change.newState == 1 &&
        this.TeenPattiHubAddress != null &&
        this.TeenPattiHubAddress != ""
      ) {
        this.subscribeTeenPatti();
      }
    });
    //Publishing an event when server pushes a subscibed market
    this.TeenPattiProxy.on("BroadcastSubscribedData", (data: any) => {
      data['teentype'] = this.Teentype;
      this._TeenPattiData.next(data);
      // console.log(data);
    });
  };

  subscribeTeenPatti() {

    this.TeenPattiProxy.invoke("SubscribeFancy", this.Teentype);
  };
  unSubscribeTeenPatti() {
    if (!this.TeenPattiConnection) {
      return;
    }
    if (this.hubConState.state == 1) {
      this.TeenPattiProxy.invoke("UnsubscribeFancy", this.Teentype);
      this.TeenPattiHubAddress = null;
      this._TeenPattiData.next(null);
      this.TeenPattiConnection.stop();
    }
  };
}
