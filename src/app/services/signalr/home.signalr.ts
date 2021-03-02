import { Injectable } from '@angular/core';
import { DataFormatService } from '../data-format.service';
import { SharedataService } from '../sharedata.service';
import { UserData } from '../../shared/models/user-data.model';

@Injectable({
  providedIn: 'root',
})
export class HomeSignalrService {
  private readonly dataHubAddress: string = 'http://167.86.74.159:5133';
  private readonly proxyToken: string = '1937-789-123';

  homeConnection: any;
  homeProxy: any;
  constructor(
    private dataFormat: DataFormatService,
    private shareData: SharedataService
  ) {}

  connectHome() {
    this.homeConnection = (<any>$).hubConnection(this.dataHubAddress);

    this.homeProxy = this.homeConnection.createHubProxy('DataHub');

    this.homeConnection
      .start()
      .done((clientHubConn: any) => {
        console.log(`Connection Established to DataHub ${clientHubConn.state}`);
        this.homeProxy.invoke('SubscribeData', this.proxyToken);
      })
      .fail((err: any) => {
        console.error(`Connection failed ${err.state}`);
      });

    this.reconnect();
    this.subscribeToMessages();
  }

  subscribeToHomeSignalR() {
    this.homeProxy.invoke('SubscribeData', this.proxyToken);
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
        this.dataFormat.navigationListFormat(data.sportsData)
      );
      this.shareData.shareuserData(data);
      this.dataFormat.shareEventData(data.sportsData);

    });
  }

  unSubscribeDataHub() {
    if (this.homeConnection && this.homeProxy) {
      this.homeProxy.invoke('UnSubscribeData', this.proxyToken);
      this.homeConnection.stop();
      this.homeConnection = null;
      this.homeProxy = null;
    }
  }
}
