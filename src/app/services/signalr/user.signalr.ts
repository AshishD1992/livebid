import { Injectable } from '@angular/core';
import { DataFormatService } from '../data-format.service';
import { TokenService } from '../token.service';
import { SharedataService } from '../sharedata.service';
// import { PlaceBetsService } from './place-bets.service'
import { UserData } from '../../shared/models/user-data.model';


@Injectable({
  providedIn: 'root'
})
export class UserSignalrService {
  private clientConnection: any;
  private clientProxy: any;
  private clientHubConn: any;

  constructor(
    private token: TokenService, 
    private dFService: DataFormatService, 
    // private PBService: PlaceBetsService
    private shareData: SharedataService) { }

  connectClient(clientHubAddress: string) {

    if (this.token.getToken()) {
      // creates a new hub connection
      this.clientConnection = (<any>$).hubConnection(clientHubAddress);

      // alert(JSON.stringify(this.clientConnection));
      // enabled logging to see in browser dev tools what SignalR is doing behind the scenes
      this.clientConnection.logging = true;
      // create a proxy
      this.clientProxy = this.clientConnection.createHubProxy("DataHub");
      // this.clientProxy.connection.logging = true;

      // start connection
      this.clientConnection.start().done((clientHubConns: any) => {
        this.clientHubConn = clientHubConns;
        console.log("Client Hub Connection Established = " + clientHubConns.state);
        this.clientProxy.invoke('SubscribeData', this.token.getToken());
      }).fail((clientHubErr: any) => {
        console.log("Could not connect Client Hub = " + clientHubErr.state)
      })

      this.clientConnection.stateChanged((change: any) => {
        if (change.state === 4 && this.clientHubConn != null) {
          this.clientConnection.start().done((clientHubConns: any) => {
            console.log("Client Hub Reconnection Established = " + clientHubConns.state);
            this.clientProxy.invoke('SubscribeData', this.token.getToken());
          }).fail((clientHubErr: any) => {
            console.log("Could not Reconnect Client Hub = " + clientHubErr.state)
          })
        }
      })


      // publish an event when server pushes a newCounters message for client
      this.clientProxy.on("BroadcastSubscribedData", (data: UserData) => {
        // console.log(data);
        this.dFService.shareNews(data.news);
        this.dFService.shareDateTime(new Date(data.curTime.replace(/ /g, "T")));
        // console.log(data.sportsData);
        
        this.dFService.shareNavigationData(this.dFService.navigationListFormat(data.sportsData));
        this.shareData.shareuserData(data);
        this.shareData.shareFancyExposure(data._fancyBook);
        var AllBetsData = {
          _userAvgmatchedBets: data._userAvgmatchedBets,
          _userMatchedBets: data._userMatchedBets,
          _userUnMatchedBets: data._userUnMatchedBets,
          _userTpBets:data._userTpBets
        };
        console.log(AllBetsData);
        this.shareData.shareAllMatchUnmatchBetsData(AllBetsData);
      })
    }
  }

  unSubscribe() {
    if (this.clientConnection && this.clientProxy) {
      this.clientProxy.invoke('UnSubscribeData', this.token.getToken());
      this.clientConnection.stop();
      this.clientConnection = null;
      this.clientProxy = null;
    }
  }

}
