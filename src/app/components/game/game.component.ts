import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DataFormatService} from 'src/app/services/data-format.service'
import { Subscription } from 'rxjs';
import { MatchOddsSignalRService} from 'src/app/services/signalr/match-odds.signalr';
import { FancyService} from 'src/app/services/signalr/fancy.signalr';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoreService } from '../../services/score.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BetsService} from 'src/app/services/bet.service'
import { SettingService } from 'src/app/services/setting.service';
@Component({
selector: 'app-game',
templateUrl: './game.component.html',
styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit,OnDestroy {
bodyElement: any;
matchedbets: any;
currTime = new Date();
fancyHubAddress: string = "http://207.180.220.254:12611";

hubAddressData: any;
allMarketData: any = [];
favouriteEvents:any= [];
eventBets = [];
fancyBookData = [];
selectedMatch: any;
context: any;
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
BetStakeSubscription: Subscription;
eventBetsSubscription: Subscription;
fancyExpoSubscription: Subscription;
bookExpoCall: boolean = false;
openBet: any;
fancyExposures: any;
stakeSetting = [];
deviceInfo: any;
width: number = 450;
height: number = 247;
betType = 4;
totalBets = 0;
OpenBetForm: FormGroup;
constructor(
  private udService: DataService,
  private dfService:DataFormatService,
  private mktService:MatchOddsSignalRService,
  private fancyService:FancyService,
  private router: Router,
  private scoreService: ScoreService,
  private sanitizer: DomSanitizer,
  private fb: FormBuilder,
  private deviceService: DeviceDetectorService,
  private betService:BetsService,
  private settingService: SettingService,
  private toastr:ToastrService
  ) {
    navigator.vibrate = navigator.vibrate;
  }

ngOnInit() {
  this.dfService._currentDateTimeSource.subscribe(data => {
    if (data) {
      this.currTime = data;
    }
  });

   
    this.getBetStakeSetting();
    this.epicFunction();
    this.getFancyExposure();
    this.UserDescription();
    this.getFavouriteMarket();
  this.bodyElement = document.querySelector('body');
console.log("favouriteEvents",this.favouriteEvents)

}
epicFunction() {
  this.deviceInfo = this.deviceService.getDeviceInfo();
  const isMobile = this.deviceService.isMobile();
  const isTablet = this.deviceService.isTablet();
  const isDesktop = this.deviceService.isDesktop();


  if (isMobile) {
    this.context = "Mobile";
  }
  if (isTablet) {
    this.context = "Tablet";
  }
  if (isDesktop) {
    this.context = "Desktop";
  }
  if (!isDesktop) {
    this.width = window.innerWidth;
    this.height = Math.ceil(this.width / 1.778);
  }
}

initOpenBetForm() {
  let info = "device:" + this.deviceInfo.device + ", os:" + this.deviceInfo.os + ", os_version:" + this.deviceInfo.os_version + ", browser:" + this.deviceInfo.browser + ", browser_version:" + this.deviceInfo.browser_version

  this.OpenBetForm = this.fb.group({
    sportId: [this.openBet.sportId],
    tourid: [this.openBet.tourid],
    matchBfId: [this.openBet.matchBfId],
    matchId: [this.openBet.matchId],
    eventId: [this.openBet.matchId],
    bfId: [this.openBet.bfId],
    mktBfId: [this.openBet.bfId],
    mktId: [this.openBet.mktId],
    marketId: [this.openBet.mktId],
    matchName: [this.openBet.matchName],
    marketName: [this.openBet.marketName],
    mktname: [this.openBet.marketName],
    isInplay: [this.openBet.isInplay],
    runnerName: [this.openBet.runnerName],
    odds: [this.openBet.odds],
    bookodds: [{ value: this.openBet.odds, disabled: true }],
    backlay: [this.openBet.backlay],
    yesno: [this.openBet.backlay == "back" ? 'yes' : 'no'],
    score: [this.openBet.score],
    rate: [this.openBet.rate],
    fancyId: [this.openBet.fancyId],
    bookId: [this.openBet.bookId],
    runnerId: [this.openBet.runnerId],
    bookType: [this.openBet.bookType],
    stake: [""],
    profit: [0],
    loss: [0],
    mtype: [this.openBet.mtype],
    info: [info],
    source: [this.context]
    // ipAddress: [this.tokenService.getIpAddrress()]
    // ipAddress:[this.ipInfo.ip]

  })
  // console.log(this.OpenBetForm.value);
}
get f()  {
  return this.OpenBetForm.controls;
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
getBetStakeSetting() {

  this.BetStakeSubscription = this.settingService.GetBetStakeSetting().subscribe(data => {
    if (data != null) {
      if (data.data.stake1 != 0 && data.data.stake2 != 0) {
        this.stakeSetting[0] = parseInt(data.data.stake1);
        this.stakeSetting[1] = parseInt(data.data.stake2);
        this.stakeSetting[2] = parseInt(data.data.stake3);
        this.stakeSetting[3] = parseInt(data.data.stake4);
        this.stakeSetting[4] = parseInt(data.data.stake5);
        this.stakeSetting[5] = parseInt(data.data.stake6);


      }
      // console.log(this.stakeSetting);
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

      _.forEach(this.favouriteEvents, (item, index) => {

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
                  this.checkOddsChange(item4, data, null);
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
  this.fancySubscription = this.fancyService.fancySource.subscribe(data => {

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
                  this.BMExposureBook(bookItem, item.markets[0].id);
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
                this.ClearAllSelection();
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
      // console.log(this.favouriteEvents);
      if (this.favouriteEvents.length == 0) {
        this.favouriteEvents = this.dfService.favouriteEventWise(data);
        console.log(this.favouriteEvents)
        this.allMarketData = [];
        _.forEach(this.favouriteEvents, (item) => {
          _.forEach(item.markets, (item2) => {
            this.allMarketData.push(item2);
            this.ExposureBook(item2);
          });
          _.forEach(item.bookRates, (item2) => {
            this.BMExposureBook(item2, item.markets[0].id);
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
            this.getMatchedUnmatchBets(matchId);
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

          _.forEach(this.allMarketData, (item2) => {
            this.mktService.UnsuscribeSingleMarket(item2.bfId);
          });
          this.mktService.UnsuscribeMarkets(this.allMarketData);
          this.fancyService.UnsuscribeFancy(this.favouriteEvents);

          this.allMarketData = [];
          _.forEach(this.favouriteEvents, (item) => {
            _.forEach(item.markets, (item2) => {
              this.allMarketData.push(item2);
              this.ExposureBook(item2);
            });
            _.forEach(item.bookRates, (item2) => {
              this.BMExposureBook(item2, item.markets[0].id);
            });
          });
          this.mktService.connectMarket(this.hubAddressData.hubAddress, this.allMarketData);
          this.fancyService.connectFancy(this.hubAddressData.fancyHubAddress, this.favouriteEvents);

          if (this.favouriteEvents.length > 0) {
            let matchId = this.favouriteEvents[this.favouriteEvents.length - 1].id;
            this.getMatchedUnmatchBets(matchId);
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
checkOddsChange(OldValue, NewValue, type) {

  if (type == 'fancy') {
    if (OldValue.noScore != NewValue.noScore) {
      const noScore = $('#' + NewValue.id + ' .lay');
      noScore.addClass('yello');
      this.removeChangeClass(noScore);
    }
    if (OldValue.yesScore != NewValue.yesScore) {
      const yesScore = $('#' + NewValue.id + ' .lay');
      yesScore.addClass('yello');
      this.removeChangeClass(yesScore);
    }

  }
  else {
    if (OldValue.back1 != NewValue.back1 || OldValue.backSize1 != NewValue.backSize1) {
      const back1 = $('#' + NewValue.selectionId + ' .back_1');
      back1.addClass('yello');
      this.removeChangeClass(back1);
    }
    if (OldValue.back2 != NewValue.back2 || OldValue.backSize2 != NewValue.backSize2) {
      const back2 = $('#' + NewValue.selectionId + ' .back_2');
      back2.addClass('yello');
      this.removeChangeClass(back2);
    }
    if (OldValue.back3 != NewValue.back3 || OldValue.backSize3 != NewValue.backSize3) {
      const back3 = $('#' + NewValue.selectionId + ' .back_3');
      back3.addClass('yello');
      this.removeChangeClass(back3);
    }
    if (OldValue.lay1 != NewValue.lay1 || OldValue.laySize1 != NewValue.laySize1) {


      const lay1 = $('#' + NewValue.selectionId + ' .lay_1');
      lay1.addClass('yello');
      this.removeChangeClass(lay1);
    }
    if (OldValue.lay2 != NewValue.lay2 || OldValue.laySize2 != NewValue.laySize2) {

      const lay2 = $('#' + NewValue.selectionId + ' .lay_2');
      lay2.addClass('yello');
      this.removeChangeClass(lay2);
    }
    if (OldValue.lay3 != NewValue.lay3 || OldValue.laySize3 != NewValue.laySize3) {

      const lay3 = $('#' + NewValue.selectionId + ' .lay_3');
      lay3.addClass('yello');
      this.removeChangeClass(lay3);
    }
  }



}
removeChangeClass(changeClass) {
  setTimeout(() => {
    changeClass.removeClass('yello');
  }, 300);
}

getOddValue(sportId, tourid, matchBfId, matchId, bfId, mktId, matchName, marketName, isInplay, runnerName, odds, backlay, score, rate, fancyId, bookId, runnerId, bookType){
  this.openBet = {
    sportId, tourid, matchBfId, matchId, bfId, mktId, matchName, marketName, isInplay, runnerName, odds, backlay, score, rate, fancyId, bookId, runnerId, bookType
  }
  if (bfId != null && mktId != null && bookType == null) {
    this.openBet['mtype'] = "market";
  }

  if (bookId != null && bookType != null) {
    this.openBet['mtype'] = "book";
  }
  if (fancyId != null) {
    this.openBet['mtype'] = "fancy";
  }
  this.initOpenBetForm();
  console.log(this.openBet)

}
BetSubmit() {
  // console.log(this.OpenBetForm)

  if (!this.OpenBetForm.valid) {
    return;
  }
  // console.log(this.OpenBetForm.value)
  // this.showLoader = true;

  if (this.OpenBetForm.value.mtype == "market") {
    this.PlaceMOBet();
  }
  else if (this.OpenBetForm.value.mtype == "fancy") {
    this.PlaceFancyBet();
  }
  else if (this.OpenBetForm.value.mtype == "book") {
    this.PlaceBookBet();
  }

}
PlaceMOBet() {

  this.betService.PlaceMOBet(this.OpenBetForm.value).subscribe(resp => {

    if (resp.status == "Success") {
      this.toastr.success(resp.result);
      // this.betPlacedPlay();
      this.afterPlaceBetExposure();
      this.OpenBetForm.reset();
      this.ClearAllSelection();
      this.dfService.shareFunds(null);
    }
    else {
      this.toastr.error(resp.result);

      if (resp.result == 'Unmatched bets not allowed') {
        // this.unmatchNotAllowPlay();
      }
    }
    // this.showLoader = false;
  }, err => {
    if (err.status == 401) {
      this.toastr.error("Error Occured");
    }
    else {
      this.toastr.error("Errors Occured");
    }
    // this.showLoader = false;
  })
}
PlaceFancyBet() {

  this.betService.PlaceFancyBet(this.OpenBetForm.value).subscribe(resp => {

    if (resp.status == "Success") {
      this.toastr.success(resp.result);
      // this.betPlacedPlay();
      this.OpenBetForm.reset();
      this.ClearAllSelection();
      this.dfService.shareFunds(null);
    }
    else {
      this.toastr.error(resp.result);
    }
    // this.showLoader = false;
  }, err => {
    if (err.status == 401) {
      this.toastr.error("Error Occured");
    }
    else {
      this.toastr.error("Errors Occured");
    }
    // this.showLoader = false;
  })
}
PlaceBookBet() {
  this.betService.PlaceBookBet(this.OpenBetForm.value).subscribe(resp => {

    if (resp.status == "Success") {
      this.toastr.success(resp.result);
      // this.betPlacedPlay();
      this.afterPlaceBetExposure();
      this.OpenBetForm.reset();
      this.ClearAllSelection();
      this.dfService.shareFunds(null);
    }
    else {
      this.toastr.error(resp.result);
    }
    // this.showLoader = false;
  }, err => {
    if (err.status == 401) {
      //this.toastr.error("Error Occured");
    }
    else {
      this.toastr.error("Errors Occured");
    }
    // this.showLoader = false;
  })
}

afterPlaceBetExposure() {
  _.forEach(this.favouriteEvents, (item) => {
    _.forEach(item.markets, (item2) => {
      if (this.OpenBetForm.value.mktId == item2.id) {
        this.ExposureBook(item2);
      }
    });
    _.forEach(item.bookRates, (item2) => {
      if (this.OpenBetForm.value.bookId == item2.id) {
        this.BMExposureBook(item2, this.OpenBetForm.value.marketId);
      }
    });
  });

}
ExposureBook(market) {
  this.betService.ExposureBook(market.id).subscribe(resp => {
    market['pnl'] = resp.data;
  }, err => {
    if (err.status == 401) {
      //this.toastr.error("Error Occured");
    }
    else {
      this.toastr.error("Errors Occured");
    }
  })
}
BMExposureBook(market, marketId) {
  this.bookExpoCall = true;
  this.betService.BMExposureBook(marketId, market.id).subscribe(resp => {
    market['pnl'] = resp.data;
    this.bookExpoCall = false;
  }, err => {
    if (err.status == 401) {
      //this.toastr.error("Error Occured");
    }
    else {
      this.toastr.error("Errors Occured");
    }
    this.bookExpoCall = false;
  })
}
getFancyBook(matchId, fancyId) {
  this.betService.Fancybook(matchId, fancyId).subscribe(resp => {
    this.fancyBookData = resp.data;
  }, err => {
    if (err.status == 401) {
      //this.toastr.error("Error Occured");
    }
    else {
      this.toastr.error("Errors Occured");
    }
  })
}
getFancyExposure() {
  this.fancyExpoSubscription = this.dfService.fancyExposureSource$.subscribe(data => {
    // console.log(data);
    if (data != null) {
      this.fancyExposures = data;
    }
  })
}

marketsNewExposure(bet) {
  _.forEach(this.favouriteEvents, (match, matchIndex) => {
    _.forEach(match.markets, (market, mktIndex) => {
      if (bet) {
        let newMktExposure = _.cloneDeep((market.pnl));
        if (bet.stake != null && market.id == bet.mktId && bet.mtype == 'market') {
          _.forEach(newMktExposure, (runner) => {
            if (bet.backlay == "back" && bet.runnerName == runner.Key) {
              if (bet.profit != null) {
                runner.Value = this.convertToFloat(parseFloat(runner.Value) + parseFloat(bet.profit));
              }
            }
            if (bet.backlay == "back" && bet.runnerName != runner.Key) {
              runner.Value = this.convertToFloat(parseFloat(runner.Value) - parseFloat(bet.loss));
            }
            if (bet.backlay == "lay" && bet.runnerName == runner.Key) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                runner.Value = this.convertToFloat(parseFloat(runner.Value) - parseFloat(bet.loss));
              }
            }
            if (bet.backlay == "lay" && bet.runnerName != runner.Key) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                runner.Value = this.convertToFloat(parseFloat(runner.Value) + parseFloat(bet.profit));
              }
            }
          })

          market['newpnl'] = newMktExposure;
        }
      }
      else {
        market['newpnl'] = null;
      }

    })
    _.forEach(match.bookRates, (book, bookIndex) => {
      if (bet) {
        let newbookExposure = _.cloneDeep((book.pnl));
        if (bet.stake != null && book.id == bet.bookId && bet.mtype == 'book') {
          _.forEach(newbookExposure, (runner) => {
            if (bet.backlay == "back" && bet.runnerName == runner.Key) {
              if (bet.profit != null) {
                runner.Value = this.convertToFloat(parseFloat(runner.Value) + parseFloat(bet.profit));
              }
            }
            if (bet.backlay == "back" && bet.runnerName != runner.Key) {
              runner.Value = this.convertToFloat(parseFloat(runner.Value) - parseFloat(bet.loss));
            }
            if (bet.backlay == "lay" && bet.runnerName == runner.Key) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                runner.Value = this.convertToFloat(parseFloat(runner.Value) - parseFloat(bet.loss));
              }
            }
            if (bet.backlay == "lay" && bet.runnerName != runner.Key) {
              if (bet.profit != null && (bet.rate == null && bet.odds != null)) {
                runner.Value = this.convertToFloat(parseFloat(runner.Value) + parseFloat(bet.profit));
              }
            }
          })

          book['newpnl'] = newbookExposure;
        }
      }
      else {
        book['newpnl'] = null;
      }
    })

  })
}
convertToFloat(value) {
  return parseFloat(value).toFixed(2);
}

getPnlValue(runner, Pnl) {
  // console.log(runner,Pnl)
  if (runner.runnerName == undefined) {
    runner['runnerName'] = runner.name;
  }
  let pnl = "";
  if (Pnl) {
    _.forEach(Pnl, (value, index) => {
      if (runner.runnerName == value.Key) {
        pnl = value.Value;
      }
    })
  }
  return pnl;
}

getPnlClass(runner, Pnl) {
  if (runner.runnerName == undefined) {
    runner['runnerName'] = runner.name;
  }
  let pnlClass = "black";
  if (Pnl) {
    _.forEach(Pnl, (value, index) => {
      if (runner.runnerName == value.Key) {
        if (value.Value >= 0) {
          pnlClass = 'profit'
        }
        if (value.Value < 0) {
          pnlClass = 'loss';
        }
      }
    })
  }
  return pnlClass;
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
trackByFancy(index, item) {
  return item.id;
}

//OPEN BET SLIP CALC

addStake(stake) {
  if (!this.OpenBetForm.value.stake) {
    this.OpenBetForm.controls['stake'].setValue(stake.toFixed(0));
  }
  else if (this.OpenBetForm.value.stake) {
    this.OpenBetForm.controls['stake'].setValue((parseFloat(this.OpenBetForm.value.stake) + stake).toFixed(0))
  }

  this.calcProfit();
}
clearStake() {
  this.OpenBetForm.controls['stake'].setValue(null);
  this.calcProfit();
}
ClearAllSelection() {
  this.openBet = null;
  this.marketsNewExposure(this.openBet);
}
update() {
  this.calcProfit();
}

incOdds() {
  if (!this.OpenBetForm.value.odds) {
    this.OpenBetForm.controls['odds'].setValue(1.00);
  }
  if (parseFloat(this.OpenBetForm.value.odds) >= 1000) {
    this.OpenBetForm.controls['odds'].setValue(1000);
    this.calcProfit();
    return false;
  }
  let odds = parseFloat(this.OpenBetForm.value.odds);
  this.OpenBetForm.controls['odds'].setValue(this.oddsDecimal(odds + this.oddsDiffCalc(odds)));

  this.calcProfit();
  // this.calcExposure(bet);
}

decOdds() {
  if (this.OpenBetForm.value.odds == "" || this.OpenBetForm.value.odds == null || parseFloat(this.OpenBetForm.value.odds) <= 1.01) {
    this.OpenBetForm.controls['odds'].setValue(1.01);
    this.calcProfit();
    return false;
  }
  let odds = parseFloat(this.OpenBetForm.value.odds);
  this.OpenBetForm.controls['odds'].setValue(this.oddsDecimal(odds - this.oddsDiffCalc(odds)));

  this.calcProfit();
  // this.calcExposure(bet);
}

incStake() {
  if (!this.OpenBetForm.value.stake) {
    this.OpenBetForm.controls['stake'].setValue(0);
  }

  if (this.OpenBetForm.value.stake > -1) {
    let stake = parseInt(this.OpenBetForm.value.stake);
    this.OpenBetForm.controls['stake'].setValue(stake + this.stakeDiffCalc(stake));
    this.calcProfit();
  }
}

decStake() {

  if (this.OpenBetForm.value.stake <= 0) {
    this.OpenBetForm.controls['stake'].setValue("");
    return false;
  }

  if (!this.OpenBetForm.value.stake) {
    this.OpenBetForm.controls['stake'].setValue(0);
  }

  if (this.OpenBetForm.value.stake > -1) {
    let stake = parseInt(this.OpenBetForm.value.stake);
    this.OpenBetForm.controls['stake'].setValue(stake - this.stakeDiffCalc(stake));
    this.calcProfit();
  }
}

calcProfit() {
  // console.log(this.OpenBetForm.value)
  if (this.OpenBetForm.value.stake &&
    this.OpenBetForm.value.odds &&
    this.OpenBetForm.value.mtype == 'market') {
    if (this.OpenBetForm.value.backlay == "back") {
      this.OpenBetForm.controls['profit'].setValue(
        ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
      this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
    } else {
      this.OpenBetForm.controls['loss'].setValue(
        ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
      this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
    }

  }

  if (this.OpenBetForm.value.stake &&
    this.OpenBetForm.value.odds &&
    this.OpenBetForm.value.mtype == 'book') {

    if (this.OpenBetForm.value.bookType == 1) {
      if (this.OpenBetForm.value.backlay == "back") {
        this.OpenBetForm.controls['profit'].setValue(((parseFloat(this.OpenBetForm.value.odds) * this.OpenBetForm.value.stake) / 100).toFixed(2));
        this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
      } else {
        this.OpenBetForm.controls['loss'].setValue(((parseFloat(this.OpenBetForm.value.odds) * this.OpenBetForm.value.stake) / 100).toFixed(2));
        this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
      }
    }

    if (this.OpenBetForm.value.bookType == 2) {
      if (this.OpenBetForm.value.backlay == "back") {
        this.OpenBetForm.controls['profit'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
      } else {
        this.OpenBetForm.controls['loss'].setValue(
          ((parseFloat(this.OpenBetForm.value.odds) - 1) * this.OpenBetForm.value.stake).toFixed(2));
        this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
      }
    }
  }

  if (this.OpenBetForm.value.rate && this.OpenBetForm.value.score && this.OpenBetForm.value.mtype == 'fancy') {
    if (this.OpenBetForm.value.backlay == "back") {
      this.OpenBetForm.controls['profit'].setValue((parseFloat(this.OpenBetForm.value.rate) * this.OpenBetForm.value.stake) / 100);
      this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
    } else {
      this.OpenBetForm.controls['loss'].setValue((parseFloat(this.OpenBetForm.value.rate) * this.OpenBetForm.value.stake) / 100);
      this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
    }
  }
  if (this.OpenBetForm.value.stake == null) {
    this.OpenBetForm.controls['profit'].setValue(0);
  }
  this.marketsNewExposure(this.OpenBetForm.value)
}

oddsDecimal(value) {
  return (value == null || value == '' || (parseFloat(value) > 19.5)) ? value : ((parseFloat(value) > 9.5) ? parseFloat(value).toFixed(1) : parseFloat(value).toFixed(2));
}

oddsDiffCalc(currentOdds) {
  var diff;
  if (currentOdds < 2) {
    diff = 0.01
  } else if (currentOdds < 3) {
    diff = 0.02
  } else if (currentOdds < 4) {
    diff = 0.05
  } else if (currentOdds < 6) {
    diff = 0.10
  } else if (currentOdds < 10) {
    diff = 0.20
  } else if (currentOdds < 20) {
    diff = 0.50
  } else if (currentOdds < 30) {
    diff = 1.00
  } else {
    diff = 2.00
  }
  return diff
}

stakeDiffCalc(currentStake) {
  var diff;


    if (currentStake <= 50) {
      diff = 5
    } else if (currentStake <= 100) {
      diff = 10
    } else if (currentStake <= 1000) {
      diff = 100
    } else if (currentStake <= 10000) {
      diff = 1000
    } else if (currentStake <= 100000) {
      diff = 10000
    } else if (currentStake <= 1000000) {
      diff = 100000
    } else if (currentStake <= 10000000) {
      diff = 1000000
    } else if (currentStake <= 100000000) {
      diff = 10000000
    } else {
      diff = 100000000
    }

  return diff
}

//CLOSE BET SLIP CALC


getDataByType(betType) {
  this.betType = betType;
}
getMatchedUnmatchBets(matchId) {
  let betMatchId = matchId;
  // betMatchId = 823;
  if (this.eventBetsSubscription) {
    this.eventBetsSubscription.unsubscribe();
  }
  let allbets;
  this.eventBetsSubscription = this.dfService.currentAllMatchUnmatchBets$.subscribe(data => {
    // console.log(betMatchId, data);

    if (data != null) {
      if (this.betType == 4) {
        allbets = this.dfService.matchUnmatchBetsFormat(data._userMatchedBets[betMatchId]);
        this.eventBets = allbets.matchWiseBets;
        this.totalBets = allbets.totalBets;
      }
      else {
        allbets = this.dfService.matchUnmatchBetsFormat(data._userUnMatchedBets[betMatchId]);
        this.eventBets = allbets.matchWiseBets;
        this.totalBets = allbets.totalBets;
      }

      // console.log(this.eventBets)
    }
  })
}
trackByBet(bet) {
  return bet.id;
}

closebetslip(){
  this.openBet = null
}

openBetbox() {
document.getElementById("mybet").style.width = "100%";
}

closebet() {
document.getElementById("mybet").style.width = "0";
}

ngAfterViewInit(){
  (this.bodyElement as HTMLElement).classList.add('clsbetshow');

  }

  ngOnDestroy(){
  (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
  _.forEach(this.favouriteEvents, (item, matchIndex) => {
  
      this.mktService.UnsuscribeSingleMarket(item.bfId);
    });
  }
}
