import { Injectable } from '@angular/core';
import { DataFormatService } from '../data-format.service';
import { SharedataService } from '../sharedata.service';
import { UserData } from '../../shared/models/user-data.model';
import { TokenService } from '../token.service';

@Injectable({
  providedIn: 'root',
})
export class HomeSignalrService {
  private clientHubAddress;

  homeConnection: any;
  homeProxy: any;
  constructor(
    private dataFormat: DataFormatService,
    private shareData: SharedataService,
    private tokenService: TokenService
  ) {}

  connectHome(clientHubAddress) {
    this.clientHubAddress = clientHubAddress;
    this.homeConnection = (<any>$).hubConnection(this.clientHubAddress);

    this.homeProxy = this.homeConnection.createHubProxy('DataHub');

    this.homeConnection
      .start()
      .done((clientHubConn: any) => {
        console.log(`Connection Established to DataHub ${clientHubConn.state}`);
        this.homeProxy.invoke('SubscribeData',this.tokenService.getToken());
      })
      .fail((err: any) => {
        console.error(`Connection failed ${err.state}`);
      });

    this.reconnect();
    this.subscribeToMessages();
  }

  subscribeToHomeSignalR() {
    this.homeProxy.invoke('SubscribeData', this.tokenService.getToken());
  }

  reconnect() {
    this.homeConnection.stateChanged((change: any) => {
      if (change.state === 4 && this.homeConnection != null) {
        this.homeConnection
          .start()
          .done((clientHubConns: any) => {
            console.log(
              'Client Hub Reconnection Established = ' + clientHubConns.state
            );
            this.homeProxy.invoke('SubscribeData');
          })
          .fail((clientHubErr: any) => {
            console.log(
              'Could not Reconnect Client Hub = ' + clientHubErr.state
            );
          });
      }
    });
  }

  subscribeToMessages() {
    this.homeProxy.on('BroadcastSubscribedData', (data: UserData) => {
      // console.log(data.sportsData);

      this.dataFormat.shareNavigationData(
        this.dataFormat.NavigationFormat(data.sportsData, data.curTime )
      );
      this.shareData.shareuserData(data);
      this.dataFormat.shareEventData(data.sportsData);
      var AllBetsData = {
        _userAvgmatchedBets: data._userAvgmatchedBets,
        _userMatchedBets: data._userMatchedBets,
        _userUnMatchedBets: data._userUnMatchedBets
      };
      this.dataFormat.shareAllMatchUnmatchBetsData(AllBetsData);
    });
  }

  unSubscribeDataHub() {
    if (this.homeConnection && this.homeProxy) {
      this.homeProxy.invoke('UnSubscribeData', this.tokenService.getToken());
      this.homeConnection.stop();
      this.homeConnection = null;
      this.homeProxy = null;
    }
  }
}
