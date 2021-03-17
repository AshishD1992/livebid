import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TeenpattiSignalRService } from '../../services/signalr/teenpatti.signalr';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Subscription, from } from 'rxjs';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';
import { ShareBetDataService } from '../../services/share-bet-data.service';
import { BetsService } from '../../services/bet.service';
import { SharedataService } from '../../services/sharedata.service';
import { take } from 'rxjs/operators';
import { ReportService } from '../../services/report.service';
import { SettingService } from 'src/app/services/setting.service';
import { DataFormatService } from 'src/app/services/data-format.service';
import { ToastrService } from 'ngx-toastr';
export const BET_TYPES = { MATCH_ODDS: 1, BOOK_MAKING: 2, FANCY: 3 };

@Component({
  selector: 'app-twentyteenpatti',
  templateUrl: './twentyteenpatti.component.html',
  styleUrls: ['./twentyteenpatti.component.scss']
})
export class TwentyteenpattiComponent implements OnInit {

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
  matchBfId = "5000"
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
  totalBets = 0;
  eventBets = [];
  OpenBetForm: FormGroup;

  eventBetsSubscription: Subscription;
  BetStakeSubscription: Subscription;

  constructor(
    private TeenpattiSignalR: TeenpattiSignalRService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private shareBetData: ShareBetDataService,
    private betsService: BetsService,
    private shareData: SharedataService,
    private reportsService: ReportService,
    private settingService: SettingService,
    private dfService: DataFormatService,
  ) { }


  ngOnInit(): void {
    console.log("", this.matchBfId);
    this.TeenpattiSignalR.TeenPattiSignalr(this.matchBfId);

    if (this.subSink) {
      this.subSink.unsubscribe();
    }
    this.subSink = new Subscription();

    this.allMKTdata();
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
    this.GetRecentGameResult();
    this.bodyElement = document.querySelector('body');

    this.andar_bahar = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    this.teenpattiSubscription = this.TeenpattiSignalR.TeenPattiData$.subscribe((data) => {
      if (data) {

        this.teentype = data.teentype;
        this.subscriptionId = this.teentype;

        if (this.teentype == 1) {
          this.tpData = data.data.t1[0];
          // console.log("",this.tpData)
          this.tpMarket = data.data.t2;
          // console.log("tpMarket", this.tpMarket)
          if (this.Oldteentype) {
            this.clock.setValue(this.tpData.autotime);
          }
          this.teenpattiId = this.tpData.mid;
          this.T20ExposureBook(this.tpData.mid, null);
        }

        if (this.teentype == 2) {
          this.tpMarket = data.data.bf;
          console.log("tpMarket", this.tpMarket)
          if (this.tpMarket[0].lastime && this.Oldteentype) {
            this.clock.setValue(this.tpMarket[0].lastime);
          }
          this.teenpattiId = this.tpMarket[0].marketId;

          this.T20ExposureBook(this.tpMarket[0].marketId, null);
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
      } catch { }
    })



  }

  initOpenBetForm() {


    this.OpenBetForm = this.fb.group({
      event: [this.placeTPData.event],
      backlay: [this.placeTPData.backlay],
      odds: [{value:this.placeTPData.odds,disabled: true}],
      runnerName: [this.placeTPData.runnerName],
      runnerId: [this.placeTPData.runnerId],
      gameId: [this.placeTPData.gameId],
      gameType: [this.placeTPData.gameType],
      runnerIndex: [this.placeTPData.runnerIndex],
      card: [this.placeTPData.gameType],

      stake: [""],
    })
    console.log(this.OpenBetForm.value);
  }

  get f() {
    return this.OpenBetForm.controls;
  }

  GetRecentGameResult() {
    this.Teentype = "1";
    this.reportsService.GetRecentGameResult(this.teentypee).subscribe(resp => {

      this.results = resp.data;
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
          this.teenpattiCalled = true;
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
      event: event,
      info: "",
      // info: `device: ${this.deviceInfo.device}, os: ${this.deviceInfo.os}, os_version: ${this.deviceInfo.os_version}, browser: ${this.deviceInfo.browser}, browser_version: ${this.deviceInfo.browser_version}`,
      odds: odds,
      runnerName: runnerName,
      runnerIndex: runnerIndex,
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

    this.initOpenBetForm();
    console.log(this.placeTPData)

  }
  closebetslip() {
    this.placeTPData = null
  }

  openBetbox() {
    document.getElementById("mybet").style.width = "100%";
  }

  closebet() {
    document.getElementById("mybet").style.width = "0";
  }
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
    // this.calcProfit();
  }

  ClearAllSelection() {
    this.placeTPData = null;
    // this.marketsNewExposure(this.openBet);
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

  getDataByType(betType) {
    this.betType = betType;
  }

  getMatchedUnmatchBets() {
    // let betMatchId = matchId;
    if (this.eventBetsSubscription) {
      this.eventBetsSubscription.unsubscribe();
    }
    let allbets;
    this.eventBetsSubscription = this.dfService.currentAllMatchUnmatchBets$.subscribe(data => {
      // console.log(betMatchId, data);

      if (data != null) {
        if (this.betType == 4) {
          allbets = this.dfService.matchUnmatchBetsFormat(data._userTpBets[this.gameId]);
          this.eventBets = allbets.matchWiseBets;
          this.totalBets = allbets.totalBets;
        }
        // console.log(this.eventBets)
      }
    })
  }

  OpenBetSlip(backlay, odds, runnerName, runnerId, gameId, gameType) {
    this.ClearAllSelection();
    this.placeTPData = {
      backlay, odds, runnerName, runnerId, gameId, gameType
    }

    this.placeTPData['gameType'] = "cards";
    console.log(this.placeTPData);
    this.initOpenBetForm();
    if (this.context != 'Mobile') {
      window.scrollTo(0, 0);
    }
  }


  PlaceTpBet() {

    this.betsService.PlaceTpBet(this.OpenBetForm.value).subscribe(resp => {




        this.OpenBetForm.reset();
        this.ClearAllSelection();
        this.dfService.shareFunds(null);



    })
  }

  T20ExposureBook(gameId: number, state: any) {
    if (gameId == 0) {
      return;
    }
    if (state != undefined) {
      this.betsService.T20ExposureBook(gameId).subscribe((data: any) => {
        this.GetRecentGameResult();
        let tpExposure = data.data;
        this.displayExposure(tpExposure, gameId);
        localStorage.setItem("T20Expo_" + gameId, JSON.stringify(tpExposure));
      });
    } else {
      let tpExposure: any;
      tpExposure = localStorage.getItem("T20Expo_" + gameId);
      if (!tpExposure) {
        this.T20ExposureBook(gameId, "1");
      } else {
        tpExposure = JSON.parse(tpExposure);
        this.displayExposure(tpExposure, gameId);
      }

    }
  }

  ExposureBook(market: any) {
    this.betService.ExposureBook(market.id).subscribe((resp: any) => {
      market['pnl'] = resp.data;
      // console.log(market);
    }, err => {
    })
  }
  getPnlValue(runner: any, Pnl: any) {
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

  getPnlClass(runner: any, Pnl: any) {
    if (runner.runnerName == undefined) {
      runner['runnerName'] = runner.name;
    }
    let pnlClass = "black";
    if (Pnl) {
      _.forEach(Pnl, (value, index) => {
        if (runner.runnerName == value.Key) {
          if (value.Value >= 0) {
            pnlClass = 'positive'
          }
          if (value.Value < 0) {
            pnlClass = 'negative';
          }
        }
      })
    }
    return pnlClass;
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


  ngOnDestroy() {

    this.teenpattiSubscription.unsubscribe();
    (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
  }
  ngAfterViewInit() {
    (this.bodyElement as HTMLElement).classList.add('clsbetshow');

  }


  trackByIndex(index: number) {
    return index;
  }

}
