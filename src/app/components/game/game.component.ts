import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DataFormatService} from 'src/app/services/data-format.service'
import { Subscription } from 'rxjs';
import { MatchOddsSignalRService} from 'src/app/services/signalr/match-odds.signalr';
import { FancySignalRService} from 'src/app/services/signalr/fancy.signalr';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoreService } from '../../services/score.service';
import _ from 'lodash';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
selector: 'app-game',
templateUrl: './game.component.html',
styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
bodyElement: any;
matchedbets: any;
currTime = new Date();
fancyHubAddress: string = "http://164.68.97.173:12111";

hubAddressData: any;
allMarketData: any = [];
favouriteEvents: any= [];
selectedMatch: any;

liveUrl: string;
url: string;
urlSafe: SafeResourceUrl;
liveUrlSafe: SafeResourceUrl;
videoEnabled: boolean = false;

UserDescSubscription: Subscription;
fancySubscription: Subscription;
marketSuscription: Subscription;
marketErrSuscription: Subscription;
favouriteSubscription: Subscription;

bookExpoCall: boolean = false;
openBet: any;
fancyExposures: any;

width: number = 450;
height: number = 247;

constructor(
  private udService: DataService,
  private dfService:DataFormatService,
  private mktService:MatchOddsSignalRService,
  private fancyService:FancySignalRService,
  private router: Router,
  private scoreService: ScoreService,
  private sanitizer: DomSanitizer,
  ) { }

ngOnInit(): void {
  this.dfService._currentDateTimeSource.subscribe(data => {
    if (data) {
      this.currTime = data;
    }
  });
  this.getFavouriteMarket();
  this.UserDescription();
  this.bodyElement = document.querySelector('body');
}

UserDescription() {
  this.UserDescSubscription = this.dfService.userDescriptionSource$.subscribe(resp => {
    if (resp) {
      if (resp.fHub) {
        this.fancyHubAddress = resp.fHub;
      }
    }
  })
}
HubAddress(market) {
  this.udService.getHubAddress(market.id).subscribe(resp => {
    this.hubAddressData = resp;
    if (this.hubAddressData.hubAddress) {
      this.mktService.connectMarket(this.hubAddressData.hubAddress, this.allMarketData);
      this.getMarketRunner();
    }
    if (this.hubAddressData.fancyHubAddress && !this.fancySubscription) {
      this.hubAddressData.fancyHubAddress = this.fancyHubAddress;
      this.fancyService.connectFancy(this.hubAddressData.fancyHubAddress, this.favouriteEvents);
      this.getFancyData();
    }
  }, err => {
    if (err.status == 401) {
      //this.toastr.error("Error Occured");
    }
  })
}
getMarketRunner() {
  this.marketSuscription = this.mktService.marketsData$.subscribe(data => {
    // console.log(data);
    if (data != null) {
      // console.log(this.favouriteEvents)
      _.forEach(this.favouriteEvents, (item, index) => {
        // console.log(this.favouriteEvents)
        // if (item.settings && this.UserSettingData) {

        //   if (this.UserSettingData[item.sportId]) {
        //     item.settings = this.UserSettingData[item.sportId];
        //   }
        // }

        _.forEach(item.markets, (item3, index3) => {
          if (item3.bfId == data.marketid) {

            item.status = data.Status.trim();
            item3.status = data.Status.trim();
            let runnersData = item3.runners;
            _.forEach(runnersData, (item4, i) => {
              if (item4.runnerName == data.runner) {

                this.favouriteEvents[index].markets[index3].runners[i] = data;
                this.favouriteEvents[index].markets[index3].runners[i]["runnerName"] = data.runner;
                this.favouriteEvents[index].markets[index3].runners[i]["status"] = data.runnerStatus;
                this.favouriteEvents[index].markets[index3].runners[i]["selectionId"] = data.selectionid;
                if (item.selectionid != 0) {
                  // this.checkOddsChange(item4, data, null);
                }
              }
            })
          }
        })
      });
    }
  });

  this.marketErrSuscription = this.mktService.currentMarketErr$.subscribe(data => {

    if (data) {
      console.log(data)
      // if (this.allMarketData[0]) {
      //   this.HubAddress(this.allMarketData[0]);
      // }
    }
  });
}

getFancyData() {
  this.fancySubscription = this.fancyService.fancyData$.subscribe(data => {

    if (data != null) {
      _.forEach(this.favouriteEvents, (item, index) => {
        if (item.id == data.matchId) {
          item.fancyData = data.data;

          let bookRatesExpo = item.bookRates;

          if (item.bmSettings) {
            _.forEach(data.bookRates, (bookItem, index2) => {
              if (bookItem) {
                bookItem.minStake = item.bmSettings.minStake;
                bookItem.maxStake = item.bmSettings.maxStake;
                bookItem['maxProfit'] = item.bmSettings.maxProfit;

                if (bookRatesExpo[index2]) {
                  if (bookItem.id == bookRatesExpo[index2].id) {
                    if (bookRatesExpo[index2]) {
                      if (bookRatesExpo[index2].pnl) {
                        bookItem['pnl'] = bookRatesExpo[index2].pnl;
                      }
                    }
                  }
                }
              }
            })
          }



          if (!this.bookExpoCall) {
            item.bookRates = data.bookRates;
          }
          if (bookRatesExpo.length > 0) {
            _.forEach(item.bookRates, (bookItem, index2) => {
              if (bookRatesExpo[index2]) {
                if (!bookRatesExpo[index2].pnl) {
                  // this.BMExposureBook(bookItem, item.markets[0].id);
                  this.bookExpoCall = true;
                }
                else {
                  if (bookRatesExpo[index2]) {
                    if (bookItem.id == bookRatesExpo[index2].id) {
                      bookItem['pnl'] = bookRatesExpo[index2].pnl;
                      bookItem['newpnl'] = bookRatesExpo[index2].newpnl;
                    }
                  }

                  // this.bookExpoCall = false;
                }
              }


            })
          }

          _.forEach(item.fancyData, (fanyItem) => {

            if (this.openBet) {
              if (this.openBet.runnerName == fanyItem.name && fanyItem.ballStatus != '') {
                // this.ClearAllSelection();
              }
            }
            if (this.fancyExposures) {
              let fancyExpo = this.fancyExposures[fanyItem.name];
              if (fancyExpo != undefined) {
                fanyItem['pnl'] = fancyExpo;
              }
            }
          });
        }
      })
    }
  })
}

getFavouriteMarket() {

  let favArray = [];
  let oldFavArray = [];

  let IsTvShow = false;

  this.favouriteSubscription = this.dfService.navigation$.subscribe(data => {
    // console.log(data)
    if (data != null) {
      console.log(this.dfService.favouriteEventWise(data));
      if (this.favouriteEvents.length == 0) {
        this.favouriteEvents = this.dfService.favouriteEventWise(data);

        this.allMarketData = [];
        _.forEach(this.favouriteEvents, (item) => {
          _.forEach(item.markets, (item2) => {
            this.allMarketData.push(item2);
            // console.log(this.allMarketData)
            // this.ExposureBook(item2);
          });
          _.forEach(item.bookRates, (item2) => {
            // this.BMExposureBook(item2, item.markets[0].id);
          });
          this.GetScoreId(item);

        });


        oldFavArray = JSON.parse(this.dfService.GetFavourites());
        if (this.hubAddressData == undefined && oldFavArray != null) {
          if (oldFavArray.length > 0) {
            if (this.allMarketData[0]) {
              this.HubAddress(this.allMarketData[0]);
            }
          }
          if (this.favouriteEvents.length > 0) {
            let matchId = this.favouriteEvents[this.favouriteEvents.length - 1].id;
            // this.getMatchedUnmatchBets(matchId);
          }
          else{
            this.router.navigate(['/dashboard']);
          }
        }
      }

      favArray = JSON.parse(this.dfService.GetFavourites());
      if (oldFavArray != null && favArray != null) {
        if (favArray.length != oldFavArray.length) {
          this.favouriteEvents = this.dfService.favouriteEventWise(data);
          oldFavArray = JSON.parse(this.dfService.GetFavourites());

          // _.forEach(this.allMarketData, (item2) => {
          //   this.mktService.UnsuscribeSingleMarket(item2.bfId);
          // });
          this.mktService.UnsuscribeMarkets(this.allMarketData);
          this.fancyService.UnsuscribeFancy(this.favouriteEvents);

          this.allMarketData = [];
          _.forEach(this.favouriteEvents, (item) => {
            _.forEach(item.markets, (item2) => {
              this.allMarketData.push(item2);
              // console.log(this.allMarketData)
              // this.ExposureBook(item2);
            });
            _.forEach(item.bookRates, (item2) => {
              // this.BMExposureBook(item2, item.markets[0].id);
            });
          });
          this.mktService.connectMarket(this.hubAddressData.hubAddress, this.allMarketData);
          this.fancyService.connectFancy(this.hubAddressData.fancyHubAddress, this.favouriteEvents);

          if (this.favouriteEvents.length > 0) {
            let matchId = this.favouriteEvents[this.favouriteEvents.length - 1].id;
            // this.getMatchedUnmatchBets(matchId);
          }
          else {
            this.router.navigate(['/dashboard']);
          }

        }
      }

    }
  })
}
GetScoreId(event) {
  if (event.sportId == 4) {
    this.scoreService.GetScoreId(event.bfId).subscribe(resp => {
      if (resp.scoreId != 0) {
        let url = 'https://shivexch.com/sport_score_api/cricketscore/index.html?scoreId=' + resp.scoreId + '&matchDate=' + event.matchDate;

        event['sportradar_url'] = this.sanitizer.bypassSecurityTrustResourceUrl(url);;
      }
    })
  }

}
openTv(match) {
  if (this.selectedMatch) {
    if (this.selectedMatch.bfId != match.bfId) {
      this.selectedMatch = match;
      this.setIframeUrl();
    }
    else {
      this.selectedMatch = null;
    }
  }
  else {
    this.selectedMatch = match;
    this.setIframeUrl();
  }

}
setIframeUrl() {
  if (this.selectedMatch) {

    // this.url = "https://videoplayer.betfair.com/GetPlayer.do?tr=1&eID=" + this.selectedMatch.bfId + "&width=" + this.width + "&height=" + this.height + "&allowPopup=true&contentType=viz&statsToggle=hide&contentOnly=true"
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    // this.liveUrl = "http://tv.allexch.com/index.html?token=696363a6-035b-450c-8ec6-312e779732ac&mtid=" + this.selectedMatch.bfId;
    this.liveUrl = this.selectedMatch.tvConfig.link;
    this.liveUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl);
    console.log(this.liveUrl)
    if (this.selectedMatch.videoEnabled) {
      this.videoEnabled = this.selectedMatch.videoEnabled;
    }
  }
}

trackByEvent(index, item) {
  return item.bfId;
}
trackByMkt(index, item) {
  return item.bfId;
}
trackByRunner(index, item) {
  return item.runnerName;
}
// GetCurrentBets(){
// this.reportService.GetCurrentBets().subscribe(data=>{
// this.matchedbets=data.matchedbets;
// })
// }
// ngAfterViewInit(){
// (this.bodyElement as HTMLElement).classList.add('clsbetshow');
// }

// ngOnDestroy(){
// (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
// }


// openBet() {
// document.getElementById("mybet").style.width = "100%";
// }

// closebet() {
// document.getElementById("mybet").style.width = "0";
// }


}
