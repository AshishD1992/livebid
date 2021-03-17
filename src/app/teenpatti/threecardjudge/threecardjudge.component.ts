import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TeenpattiSignalRService } from '../../services/signalr/teenpatti.signalr';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Subscription, from } from 'rxjs';
import { ShareBetDataService } from '../../services/share-bet-data.service';
import { BetsService } from '../../services/bet.service';
import { SharedataService } from '../../services/sharedata.service';
import { take } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';
// import { TpMarket } from '../../models/tpmarket.model';
export const BET_TYPES = { MATCH_ODDS: 1, BOOK_MAKING: 2, FANCY: 3 };

@Component({
  selector: 'app-threecardjudge',
  templateUrl: './threecardjudge.component.html',
  styleUrls: ['./threecardjudge.component.scss']
})
export class ThreecardjudgeComponent implements OnInit {

  clock: any;
  bodyElement: any;
  matchedbets: any;
  [x: string]: any;
  teenpattiId!: number
  tpData: any = [];

  subSink!: Subscription;
  tpMarket: any;
  openCards: any
  Aallcards = [];
  Ballcards = [];
  Aresults = [];
  Bresults: any;
  matchBfId= "5004"
  AndarValues: any = []
  BaharValues: any = []
  andar_bahar: any
  teentype: any;
  teentypee: any;
  Oldteentype: any;
  subscriptionId: any;
  teenpattiSubscription!: Subscription;
  cards: any = [];
  placeTPData: any;
  clock: any;
  rowData: any;
  results: any = [];

  constructor(
    private TeenpattiSignalR: TeenpattiSignalRService,
    private route: ActivatedRoute,
    private shareBetData: ShareBetDataService,
    private betsService: BetsService,
    private shareData: SharedataService,
    private reportsService: ReportService,
  ) { }



  ngOnInit(): void {
    console.log("",this.matchBfId);
this.TeenpattiSignalR.TeenPattiSignalr(this.matchBfId);

if (this.subSink) {
        this.subSink.unsubscribe();
      }
      this.subSink = new Subscription();

    this.allMKTdata() ;
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
    this. GetRecentGameResult();
    this.bodyElement = document.querySelector('body');

    this.andar_bahar = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    this.teenpattiSubscription = this.TeenpattiSignalR.TeenPattiData$.subscribe((data) => {
      if (data) {

        this.teentype = data.teentype;
        this.subscriptionId = this.teentype;
        if (this.teentype == 1) {
          this.tpData = data.data.t1[0];
          this.tpMarket = data.data.t2;
          if (this.Oldteentype) {
            this.clock.setValue(this.tpData.autotime);
          }
          this.teenpattiId = this.tpData.mid;

        }

        if (this.teentype == 2) {
          this.tpMarket = data.data.bf;
          if (this.tpMarket[0].lastime && this.Oldteentype) {
            this.clock.setValue(this.tpMarket[0].lastime);
          }
          this.teenpattiId = this.tpMarket[0].marketId;


        }
        if (this.teentype == 5) {
          this.tpData = data.data.t1[0];
          if (this.Oldteentype) {
            this.clock.setValue(this.tpData.autotime);
          }
          this.tpMarket = data.data.t2;
          this.teenpattiId = this.tpData.mid;



        }
        if (this.teentype == 6) {
          this.tpData = data.data.t1[0];
          if (this.Oldteentype) {
            this.clock.setValue(this.tpData.autotime);
          }
          this.tpMarket = data.data.t2;
          this.teenpattiId = this.tpData.mid;

          this.ThreeCardJExposureBook(this.tpData.mid, null);
console.log("log", this.tpData)
// console.log("loggg", this. this.tpMarket)
        }
        if (this.teentype == 7) {
          this.tpData = data.data.t1[0];
          this.tpMarket = data.data.t2;
          this.AndarValues = [];
          this.BaharValues = [];
          this.Aallcards = [];
          this.Ballcards = [];
          this.Aresults = [];
          this.Bresults = [];
          if (data.data.t3[0].aall != "") {
            this.Aallcards = data.data.t3[0].aall.split(',');
          }
          if (data.data.t3[0].ball != "") {
            this.Ballcards = data.data.t3[0].ball.split(',');
          }
          if (data.data.t3[0].ar != "") {
            this.Aresults = data.data.t3[0].ar.split(',');
          }
          if (data.data.t3[0].br != "") {
            this.Bresults = data.data.t3[0].br.split(',');
          }
          _.forEach(this.tpMarket, (item, index) => {

            var andarbaharnat = item.nation.split(" ");
            if (andarbaharnat[0] == "Ander") {
              this.AndarValues.push(item);
            }
            if (andarbaharnat[0] == "Bahar") {
              this.BaharValues.push(item);
            }
          })
          if (this.Oldteentype) {
            this.clock.setValue(this.tpData.autotime);
          }
          this.teenpattiId = this.tpData.mid;


        }

        this.shareData.shareMatchId(this.teenpattiId);

        if (!this.Oldteentype) {
          this.clock = (<any>$(".clock")).FlipClock(99, {
            clockFace: "Counter"
          });
          setTimeout(() => {
            this.Oldteentype = this.teentype;
          }, 1000)
          this.GetRecentGameResult();

          // this.clock = new FlipClock($(".clock"), 99, {
          //   clockFace: "Counter"
          // });
          // setTimeout(() => {
          //   this.Oldteentype = this.teentype;
          // }, 1000)
        }
      }
    });


    this.shareBetData.clearlBetSlip$.subscribe(data => {
      this.placeTPData = data;
      this.cards = [];
    })

    this.shareBetData.exposure$.subscribe(data => {
      try {
        if (data.gameId) {
          if (data.gameType == 1 || data.gameType == 2) {
            this.T20ExposureBook(data.gameId, '1');
          }
          if (data.gameType == 5) {
            this.Lucky7ExposureBook(data.gameId, '1');
          }
          if (data.gameType == 6) {
            this.ThreeCardJExposureBook(data.gameId, '1');
          }
          if (data.gameType == 7) {
            this.AndarBaharExposureBook(data.gameId, '1');
          }

        }
      } catch{ }
    })



  }
  GetRecentGameResult() {
    this.teentypee = "6"
    this.reportsService.GetRecentGameResult(this.teentypee).subscribe(data=> {

      this.results = data.data;
      console.log("", this.results)
    })

  }
  allMKTdata() {
    this.getHubAddressCalled = false;
    this.currentEventSub = this.shareData.userData$.subscribe((userData) => {
      try {
        this.allMarketsData = this.dataFormat.sportsDataById(
          userData!.sportsData
        );

        this.currentEventData = this.dataFormat.sportsDataById(
          userData!.sportsData
        )[this.sportBfId!].tournaments[this.tourBfId!].matches[this.matchId!];

        console.log(this.currentEventData)
        this.shareBetData.shareCurrentTvSetting({ matchBfId: this.currentEventData.bfId, videoEnabled: this.currentEventData.videoEnabled });

        this.bookMakingData = this.currentEventData.bookRates;
        this.homeCommentary = this.currentEventData.commentary;
        this.homeDataMode = this.currentEventData.dataMode;
        this.homeDisplayApplication = this.currentEventData.displayApplication;
        this.homeFancyData = this.currentEventData.fancyData;
        this.homeHasFancy = this.currentEventData.hasFancy;
        this.homeInPlay = this.currentEventData.inPlay;
        this.homeStartDate = this.currentEventData.startDate;
        this.homeMarkets = this.dataFormat.marketsWise(
          this.currentEventData.markets
        );
        this.sportName = this.allMarketsData[this.sportBfId!].name;
        this.tournamentName = this.allMarketsData[this.sportBfId!].tournaments[
          this.tourBfId!
        ].name;
        this.matchName = this.currentEventData.name;
        this.homeOddsType = this.currentEventData.oddsType;
        this.homeSettings = this.currentEventData.settings;
        this.homeStatus = this.currentEventData.status;
        this.tvConfig = this.currentEventData.tvConfig;
        if (
          this.auth.isLoggedIn() &&
          !this.getHubAddressCalled &&
          this.homeDataMode === 1
        ) {
          this.getHubAddressCalled = true;
          this.getHubAddress();
          this.currentEventSub.unsubscribe();

          _.forEach(this.homeMarkets, (item2) => {
            this.ExposureBook(item2);
          })
        }
        if (this.sportBfId == 2000 && this.auth.isLoggedIn() && !this.teenpattiCalled) {
          this.teenpattiCalled=true;
          this.teensignalr.TeenPattiSignalr(this.matchBfId);
        }
        this.shareData.shareMatchId(this.matchId!);
        // this.sharedata.shareTvConfig({ tvConfig: this.tvConfig, mtBfId: this.mtBfId });
      } catch (e) { }
    });
    this.subSink.add(this.currentEventSub);
  }
  openTpBetSlip(event: any, backlay: string, odds: string, runnerName: string, runnerId: number, gameId: number, gameType: number, runnerIndex: any, card: any) {
    console.log(event, backlay, odds, runnerName, runnerId, gameId, gameType, runnerIndex, card);
    $('body').addClass('menu-is-toggled');
    $('.mybets').addClass('active');
    this.placeTPData = {
      backlay: backlay,
      gameType: gameType,
      info: "",
      // info: `device: ${this.deviceInfo.device}, os: ${this.deviceInfo.os}, os_version: ${this.deviceInfo.os_version}, browser: ${this.deviceInfo.browser}, browser_version: ${this.deviceInfo.browser_version}`,
      odds: odds,
      runnerName: runnerName,
      runnerId: runnerId,
      source: "Mobile",
      stake: 0,
      profit: 0,
      gameId: gameId,
      betType: 4
    };
    if (card) {
      if (this.cards.length < 3) {
        let indexcheck = this.cards.indexOf(card);
        if (indexcheck == -1) {
          this.cards.push(card);
        }
      }
    }

    if (this.cards.length != 0) {
      this.placeTPData['cards'] = this.cards;
      this.placeTPData.runnerName = this.placeTPData.runnerName + ' ' + this.placeTPData.cards.toString().replace(/,/g, '');
    }

    if (card) {
      if (this.cards.length > 2) {
        this.shareBetData.shareBetsData(this.placeTPData);
      }
    } else {
      this.shareBetData.shareBetsData(this.placeTPData);
    }

  }

  selected3cardj(card: any, backlay: any): any {
    let selected = false;
    if (!this.placeTPData) {
      return selected;
    }
    if (!this.placeTPData.cards) {
      return selected;
    }

    if (this.placeTPData.backlay === backlay) {
      // card = card.toString();
      let indexcheck = this.placeTPData.cards.indexOf(card);
      if (indexcheck > -1) {
        return selected = true;
      }
    }
  }

  ThreeCardJExposureBook(gameId: number, state: any) {
    if (gameId == 0) {
      return;
    }
    if (state != undefined) {
      this.betsService.ThreeCardJExposureBook(gameId).subscribe((data: any) => {
        this.GetRecentGameResult();
        let tpExposure = data.data;
        this.displayExposure(tpExposure, gameId);
        localStorage.setItem("ThreeCardJExpo_" + gameId, JSON.stringify(tpExposure));
      });
    } else {
      let tpExposure: any;
      tpExposure = localStorage.getItem("ThreeCardJExpo_" + gameId);
      if (!tpExposure) {
        this.ThreeCardJExposureBook(gameId, "1");
      }
      else {
        tpExposure = JSON.parse(tpExposure);
        this.displayExposure(tpExposure, gameId);
      }

    }
  }

  displayExposure(tpExposure: any, gameId: any) {
    _.forEach(tpExposure, function (item, index) {
      var runnerName = item.Key.replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "_");
      $("#Tp_" + gameId + "_" + runnerName).removeClass("win");
      $("#Tp_" + gameId + "_" + runnerName).removeClass("lose");
      if (item.Value >= 0) {
        $("#Tp_" + gameId + "_" + runnerName).text(item.Value).addClass("win");
      } else if (item.Value <= 0) {
        $("#Tp_" + gameId + "_" + runnerName).text("(" + item.Value + ")").addClass("lose");
      }
    });
  }





  ngAfterViewInit(){
    (this.bodyElement as HTMLElement).classList.add('clsbetshow');
    throw new Error('Method not implemented.');

    }

    ngOnDestroy(){
      this.teenpattiSubscription.unsubscribe();
    (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
    }

  trackByIndex(index: number) {
    return index;
  }

}
