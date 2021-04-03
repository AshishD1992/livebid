import { AfterViewInit, Component, OnDestroy, OnInit,ElementRef } from '@angular/core';
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
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
export const BET_TYPES = { MATCH_ODDS: 1, BOOK_MAKING: 2, FANCY: 3 };

@Component({
  selector: 'app-twentyteenpatti',
  templateUrl: './twentyteenpatti.component.html',
  styleUrls: ['./twentyteenpatti.component.scss']
})
export class TwentyteenpattiComponent implements OnInit,OnDestroy,AfterViewInit {

  clock: any;
  bodyElement: any;
  matchedbets: any;
 
  teenpattiId!: number
  tpData: any = [];
  context:any;
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
  deviceInfo: any;
  rowData: any;
  results: any = [];
  openBet: any;
  totalBets = 0;
  eventBets = [];
  stakeSetting = [];
  betType = 4;
  gameId: number=0;
  gameType: number = 2;
  OpenBetForm: FormGroup;
  showLoader: boolean = false;
  eventBetsSubscription: Subscription;
  BetStakeSubscription: Subscription;
  defaultBetStakes!: {
    stake1: number;
    stake2: number;
    stake3: number;
    stake4: number;
    stake5: number;
    stake6: number;
  };

  constructor(
    private TeenpattiSignalR: TeenpattiSignalRService,
    private route: ActivatedRoute,
    private shareBetData: ShareBetDataService,
    private betsService: BetsService,
    private shareData: SharedataService,
    private reportsService: ReportService,
    private _elRef: ElementRef,
    private fb: FormBuilder,
    private deviceService: DeviceDetectorService,
    private dfService:DataFormatService,
    private toastr: ToastrService,
    private settingService: SettingService,
  ) { }


  ngOnInit(): void {
    
    this.TeenpattiSignalR.TeenPattiSignalr(this.matchBfId);
    console.log("A", this.matchBfId);

    if (this.subSink) {
      this.subSink.unsubscribe();
    }
    this.subSink = new Subscription();

   
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
    // this.GetRecentGameResult();
    this.bodyElement = document.querySelector('body');
    this.epicFunction();

    
    this.getBetStakeSetting();
    this.teenpattiSubscription = this.TeenpattiSignalR.TeenPattiData$.subscribe((data) => {
      // console.log(data)

      if(data==null){
        this.TeenpattiSignalR.TeenPattiSignalr(this.matchBfId);
      }

      if (data) {

        this.teentype = data.teentype;
        this.subscriptionId = this.teentype;

        if (this.teentype == 1) {
          this.tpData = data.data.t1[0];
          // console.log("tpData",this.tpData)
          this.tpMarket = data.data.t2;
          // console.log("tpMarket", this.tpMarket)
          if (this.Oldteentype) {
            this.clock.setValue(this.tpData.autotime);
          }
          this.teenpattiId = this.tpData.mid;
          this.getMatchedUnmatchBets(this.teenpattiId);
          // this.T20ExposureBook(this.tpData.mid, null);
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
          if (data.gameType == 1 || data.gameType == 2) {
            // this.T20ExposureBook(data.gameId, '1');
          }
          

        }
      } catch { }
    })



  }

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

  GetRecentGameResult() {
    this.teentypee = "1";
    this.reportsService.GetRecentGameResult(this.teentypee).subscribe(data => {

      this.results = data.data;
      console.log("", this.results)
    })
  }

  openBetbox() {
    document.getElementById("mybet").style.width = "100%";
    }

    closebet() {
    document.getElementById("mybet").style.width = "0";
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
          else {
            this.defaultBetStakes = {
              stake1: 100,
              stake2: 500,
              stake3: 1000,
              stake4: 2000,
              stake5: 5000,
              stake6: 10000,
            };
            this.stakeSetting[0] = this.defaultBetStakes.stake1;
            this.stakeSetting[1] = this.defaultBetStakes.stake2;
            this.stakeSetting[2] = this.defaultBetStakes.stake3;
            this.stakeSetting[3] = this.defaultBetStakes.stake4;
            this.stakeSetting[4] = this.defaultBetStakes.stake5;
            this.stakeSetting[5] = this.defaultBetStakes.stake6;
          }
        }


      })
    }
    openTpBetSlip(backlay, odds, runnerName, runnerId, gameId, gameType) {
      this.ClearAllSelection();
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
    ClearAllSelection() {
      this.openBet = null;
    }
    getMatchedUnmatchBets(matchId) {
      let betMatchId = matchId;
      if (this.eventBetsSubscription) {
        this.eventBetsSubscription.unsubscribe();
      }
      let allbets;
      this.eventBetsSubscription = this.dfService.currentAllMatchUnmatchBets$.subscribe(data => {
        // console.log(betMatchId, data);

        if (data != null) {
          if (this.betType == 4) {
            allbets = this.dfService.matchUnmatchBetsFormat(data._userTpBets[betMatchId]);
            this.eventBets = allbets.matchWiseBets;
            this.totalBets = allbets.totalBets;
          }
          // console.log(this.eventBets)
        }
      })
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
      if (this.OpenBetForm.value.stake &&
        this.OpenBetForm.value.odds &&
        this.OpenBetForm.value.gameType == 1) {
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
        this.OpenBetForm.value.gameType == 2) {
        if (this.OpenBetForm.value.backlay == "back") {
          this.OpenBetForm.controls['profit'].setValue(
            ((parseFloat(this.OpenBetForm.value.odds) * this.OpenBetForm.value.stake) / 100).toFixed(2));
          this.OpenBetForm.controls['loss'].setValue(this.OpenBetForm.value.stake);
        } else {
          this.OpenBetForm.controls['loss'].setValue(
            ((parseFloat(this.OpenBetForm.value.odds) * this.OpenBetForm.value.stake) / 100).toFixed(2));
          this.OpenBetForm.controls['profit'].setValue(this.OpenBetForm.value.stake);
        }

      }


      if (this.OpenBetForm.value.stake == null) {
        this.OpenBetForm.controls['profit'].setValue(0);
      }
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
  T20ExposureBook(gameId: number, state: any) {
    if (gameId == 0) {
      return;
    }
    if (state != undefined) {
      this.betsService.T20ExposureBook(gameId).subscribe((data: any) => {
        // this.GetRecentGameResult();
        let tpExposure = data.data;
        this.displayExposure(tpExposure, gameId);
        localStorage.setItem("T20Expo_" + gameId, JSON.stringify(tpExposure));
      });
    } else {
      let tpExposure: any;
      tpExposure = localStorage.getItem("T20Expo_" + gameId);
      if (!tpExposure) {
        // this.T20ExposureBook(gameId, "1");
      } else {
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


  onClick(event) {

    if (!this._elRef.nativeElement.contains(event.target)) {
      $('body').removeClass('menu-is-toggledddd');
    }
  }
  trackByBet(bet) {
    return bet.id;
  }
  update() {
    this.calcProfit();
  }
  closebetslip(){
    this.openBet = null
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
  getDataByType(betType) {
    this.betType = betType;
  }
  BetSubmit() {
    console.log(this.OpenBetForm)

    if (!this.OpenBetForm.valid) {
      return;
    }
    console.log(this.OpenBetForm.value)
    this.showLoader = true;

    if (this.OpenBetForm.value.mtype == "casino") {
      this.PlaceTpBet();
    }

  }
  PlaceTpBet() {

    this.betsService.PlaceTpBet(this.OpenBetForm.value).subscribe(resp => {
      console.log(resp)
      if (resp.status == "Success") {
        this.toastr.success(resp.result);
        // this.T20ExposureBook();
        this.OpenBetForm.reset();
        this.ClearAllSelection();
        this.dfService.shareFunds(null);
      }
      else {
        this.toastr.error(resp.result);
      }
      this.showLoader = false;
    }, err => {
      if (err.status == 401) {
        this.toastr.error(err.error.description.result);
      }
      else {
        this.toastr.error("Errors Occured");
      }
      this.showLoader = false;
    })
  }


  ngAfterViewInit(){
    (this.bodyElement as HTMLElement).classList.add('clsbetshow');

    }

  ngOnDestroy(){
    this.TeenpattiSignalR.unSubscribeTeenPatti();
    this.teenpattiSubscription.unsubscribe();
    (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
    this.subSink.unsubscribe();
  
    this.shareData.shareMatchId(0);
  }

  trackByIndex(index: number) {
    return index;
  }

}
