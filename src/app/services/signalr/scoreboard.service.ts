import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ScoreboardService {
  MatchScoreHubAddress:any;
  MatchScoreConnection:any;
  MatchScoreProxy:any;
  Sessionfeeds:any;
  scorehubconn:any;

  scoreSource: Observable<any>;
  private currentScore: BehaviorSubject<any>;

  constructor() { 
    this.currentScore = <BehaviorSubject<any>>new BehaviorSubject(null);
    this.scoreSource = this.currentScore.asObservable();
  }

  MatchScoreSignalr(HubAddress:any, matchBfId:any) {
    this.MatchScoreHubAddress = HubAddress;
    this.MatchScoreConnection = $.hubConnection(this.MatchScoreHubAddress);

    this.MatchScoreProxy = this.MatchScoreConnection.createHubProxy("ScoreHub");

    this.MatchScoreConnection.start()
      .done((myHubConnection:any) => {
        var hubConState = myHubConnection.state;
        this.scorehubconn = myHubConnection;
        console.log("Match Score Connection Established= " + hubConState);
        this.MatchScoreProxy.invoke("SubscribeMatch", matchBfId);
      })
      .fail((myHubConnection:any) => {
        var hubConState = myHubConnection.state;
        console.log("Could not connect= " + hubConState);
      });

    this.MatchScoreConnection.stateChanged((change:any) => {
      if (
        change.newState != 1 &&
        this.MatchScoreHubAddress != null &&
        this.scorehubconn != null
      ) {
        this.MatchScoreConnection.start()
          .done((myHubConnection:any) => {
            var hubConState = myHubConnection.state;
            this.scorehubconn = myHubConnection;
            console.log(
              "Match Score ReConnection Established = " + hubConState
            );
            this.MatchScoreProxy.invoke("SubscribeMatch", matchBfId);
          })
          .fail((scoreHuberr:any) => {
            console.log(
              "Match Score ReConnection Established Failed = " + scoreHuberr
            );
          });
      }
    });

    this.MatchScoreProxy.on("BroadcastSubscribedData", (data:any) => {
        console.log(data);
      this.currentScore.next(data);
      // this.SessionData(data.fancy);
    });
  }

  // subscribeMatchScore(matchBfId) {

  // }

  unSubscribeMatchScore(matchBfId:any) {
    if (!this.scorehubconn) {
      return;
    }
    if (this.scorehubconn.state == 1) {
      this.MatchScoreHubAddress = null;
      this.MatchScoreProxy.invoke("UnSubscribeMatch", matchBfId);

      this.MatchScoreConnection.stop();
      this.currentScore.next(null);
      console.log("Unsubscribed score signalr for: ", matchBfId);
      
    }
  }

}
