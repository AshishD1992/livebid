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
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataFormatService } from 'src/app/services/data-format.service';
import { SettingService } from 'src/app/services/setting.service';
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
  eventBetsSubscription: Subscription;
  BetStakeSubscription: Subscription;
  placeTPData: any;

  rowData: any;
  results: any = [];
  cards:any
  openBet: any;
  seletedCards = [];
  tpBetSlip: any;
  deviceInfo: any;
  context: any;
  OpenBetForm: FormGroup;
  gameType: number = 6;

  betType = 4;
  eventBets = [];
  totalBets = 0;
  gameId: number;
  stakeSetting = [];
  constructor(
    private TeenpattiSignalR: TeenpattiSignalRService,
    private route: ActivatedRoute,
    private shareBetData: ShareBetDataService,
    private betsService: BetsService,
    private shareData: SharedataService,
    private reportsService: ReportService,
    private deviceService: DeviceDetectorService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dfService:DataFormatService,
    private settingService: SettingService,
  ) { }



  ngOnInit(): void {
    console.log("",this.matchBfId);
  this.TeenpattiSignalR.TeenPattiSignalr(this.matchBfId);

    if (this.subSink) {
        this.subSink.unsubscribe();
      }
      this.subSink = new Subscription();

    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
    // this. GetRecentGameResult();
    this.bodyElement = document.querySelector('body');
    this.epicFunction();

    this.getBetStakeSetting();
    this.andar_bahar = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    this.teenpattiSubscription = this.TeenpattiSignalR.TeenPattiData$.subscribe((data) => {
      if (data) {

        this.teentype = data.teentype;
        this.subscriptionId = this.teentype;

        if (this.teentype == 6) {
          this.tpData = data.data.t1[0];
          if (this.Oldteentype) {
            this.clock.setValue(this.tpData.autotime);
          }
          this.tpMarket = data.data.t2;
          this.teenpattiId = this.tpData.mid;

          // this.ThreeCardJExposureBook(this.tpData.mid, null);
            // console.log("log", this.tpMarket)

        }

        this.shareData.shareMatchId(this.teenpattiId);

        if (!this.Oldteentype) {
          this.clock = (<any>$(".clock")).FlipClock(99, {
            clockFace: "Counter"
          });
          setTimeout(() => {
            this.Oldteentype = this.teentype;
          }, 1000)
          // this.GetRecentGameResult();

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

          if (data.gameType == 6) {
            // this.ThreeCardJExposureBook(data.gameId, '1');
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
  selected3cardj(card, backlay) {
    let selected = false;
    if (!this.tpBetSlip) {
      return selected;
    }

    if (this.tpBetSlip.backlay === backlay) {
      let indexcheck = this.seletedCards.indexOf(card);
      if (indexcheck > -1) {
        return selected = true;
      }
    }
  };
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktop = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktop); // returns if the app is running on a Desktop browser.

    if (isMobile) {
      this.context = "Mobile";
    }
    if (isTablet) {
      this.context = "Tablet";
    }
    if (isDesktop) {
      this.context = "Desktop";
    }
  }
  initOpenBetForm() {
    let info = "device:" + this.deviceInfo.device + ", os:" + this.deviceInfo.os + ", os_version:" + this.deviceInfo.os_version + ", browser:" + this.deviceInfo.browser + ", browser_version:" + this.deviceInfo.browser_version
    // let info="";
    this.OpenBetForm = this.fb.group({
      runnerName: [this.openBet.runnerName],
      odds: [this.openBet.odds],
      tpodds: [{ value: this.openBet.odds, disabled: true }],
      backlay: [this.openBet.backlay],
      runnerId: [this.openBet.runnerId],
      gameId: [this.openBet.gameId],
      gameType: [this.openBet.gameType],
      stake: [""],
      profit: [0],
      loss: [0],
      mtype: [this.openBet.mtype],
      info: [info],
      source: [this.context]
    })
    console.log(this.OpenBetForm.value);
  }
  get f() {
    return this.OpenBetForm.controls;
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
  openTpBetSlip(backlay, odds, runnerName, runnerId, gameId, gameType, card) {
    if (card) {
      if (this.tpBetSlip) {
        if (this.tpBetSlip.backlay != backlay) {
          return false
        }
      }
      this.tpBetSlip = {
        backlay, odds, runnerName, runnerId, gameId, gameType
      }
      console.log(this.seletedCards);
      if (this.seletedCards.length < 3) {
        this.seletedCards.push(card);
      }
    } else {
      this.ClearAllSelection();
    }

    if (!card) {
      this.openBet = {
        backlay, odds, runnerName, runnerId, gameId, gameType
      }
      this.openBet['mtype'] = "casino";
      console.log(this.openBet);
      this.initOpenBetForm();
      if (this.context != 'Mobile') {
        window.scrollTo(0, 0);
      }
    }

    if (this.seletedCards.length > 2) {
      this.openBet = {
        backlay, odds, runnerName, runnerId, gameId, gameType
      }
      this.openBet['mtype'] = "casino";
      this.openBet.runnerName = this.openBet.runnerName + ' ' + this.seletedCards.toString().replace(/,/g, "");

      console.log(this.openBet);
      this.initOpenBetForm();
      if (this.context != 'Mobile') {
        window.scrollTo(0, 0);
      }
    }

  }
  BetSubmit() {
    console.log(this.OpenBetForm)

    if (!this.OpenBetForm.valid) {
      return;
    }
    console.log(this.OpenBetForm.value)
    // this.showLoader = true;

    if (this.OpenBetForm.value.mtype == "casino") {
      this.PlaceTpBet();
    }

  }

  PlaceTpBet() {

    this.betsService.PlaceTpBet(this.OpenBetForm.value).subscribe(resp => {

      if (resp.status == "Success") {
        this.toastr.success(resp.result);
        // this.ThreeCardJExposureBook();
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
        this.toastr.error(err.error.description.result);
      }
      else {
        this.toastr.error("Errors Occured");
      }
      // this.showLoader = false;
    })
  }
   ClearAllSelection() {
    this.openBet = null;
    this.tpBetSlip = null;
    this.seletedCards = [];
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

  calcProfit() {
    if (this.OpenBetForm.value.stake &&
      this.OpenBetForm.value.odds &&
      this.OpenBetForm.value.mtype == 'casino') {
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


    if (this.OpenBetForm.value.stake == null) {
      this.OpenBetForm.controls['profit'].setValue(0);
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

  trackByBet(bet) {
    return bet.id;
  }
  ThreeCardJExposureBook(gameId: number, state: any) {
    if (gameId == 0) {
      return;
    }
    if (state != undefined) {
      this.betsService.ThreeCardJExposureBook(gameId).subscribe((data: any) => {
        // this.GetRecentGameResult();
        let tpExposure = data.data;
        this.displayExposure(tpExposure, gameId);
        localStorage.setItem("ThreeCardJExpo_" + gameId, JSON.stringify(tpExposure));
      });
    } else {
      let tpExposure: any;
      tpExposure = localStorage.getItem("ThreeCardJExpo_" + gameId);
      if (!tpExposure) {
        // this.ThreeCardJExposureBook(gameId, "1");
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


    }

    ngOnDestroy(){
      this.teenpattiSubscription.unsubscribe();
    (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
    }

  trackByIndex(index: number) {
    return index;
  }
  closebet() {
    document.getElementById("mybet").style.width = "0";
    }
 closebetslip(){
      this.openBet = null
    }

}
