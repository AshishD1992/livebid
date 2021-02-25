import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { TeenpattiSignalRService } from '../services/signalr/teenpatti.signalr';
import { ActivatedRoute } from '@angular/router';
import { TpMarket } from '../models/tpmarket.model'
import * as _ from 'lodash';
import { Subscription, from } from 'rxjs';
import { ShareBetDataService } from '../service/share-bet-data.service';
import { BetsService } from '../service/bets.service';
import { SharedataService } from '../services/sharedata.service';

@Component({
  selector: 'app-teenpatti',
  templateUrl: './teenpatti.component.html',
  styleUrls: ['./teenpatti.component.scss']
})
export class TeenpattiComponent  implements OnInit,AfterViewInit ,OnDestroy{
  clock: any;
  bodyElement: any;
  matchedbets: any;
  [x: string]: any;
  // matchTime: Date = new Date();
  // matchName!: string;
  teenpattiId!: number
  tpData: any = [];
  // tpMarket!: TpMarket[]
  tpMarket: any;
  openCards: any
  Aallcards = [];
  Ballcards = [];
  Aresults = [];
  Bresults: any;
  matchBfId: any
  AndarValues: any = []
  BaharValues: any = []
  andar_bahar: any
  teentype: any;
  Oldteentype: any;
  subscriptionId: any;
  teenpattiSubscription!: Subscription;
  cards: any = [];
  placeTPData: any;
  clock: any;
  rowData: any;
  results: any = [];
  teenbfid='5001';
  constructor(
    private TeenpattiSignalR: TeenpattiSignalRService,
    private route: ActivatedRoute,
    private shareBetData: ShareBetDataService,
    private betsService: BetsService,
    private shareData: SharedataService,
  ) { }
  

  ngOnInit(): void {
    this.clock = (<any>$(".clock")).FlipClock(99, {
      clockFace: "Counter"
    });
    
   this.TeenpattiSignalR.TeenPattiSignalr(this.teenbfid);
    this.bodyElement = document.querySelector('body');


      this.andar_bahar = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  
      this.teenpattiSubscription = this.TeenpattiSignalR.TeenPattiData$.subscribe((data) => {
        if (data) {
  
          this.teentype = data.teentype;
          this.subscriptionId = this.teentype;
          if (this.teentype == 1) {
            this.tpData = data.data.t1[0];
            this.tpMarket = data.data.t2;
            console.log("tpMarket", this.tpMarket)
            if (this.Oldteentype) {
              this.clock.setValue(this.tpData.autotime);
            }
            this.teenpattiId = this.tpData.mid;
            this.T20ExposureBook(this.tpData.mid, null);
          }
  
          if (this.teentype == 2) {
            this.tpMarket = data.data.bf;
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
  
            this.Lucky7ExposureBook(this.tpData.mid, null);
  
          }
          if (this.teentype == 6) {
            this.tpData = data.data.t1[0];
            if (this.Oldteentype) {
              this.clock.setValue(this.tpData.autotime);
            }
            this.tpMarket = data.data.t2;
            this.teenpattiId = this.tpData.mid;
  
            this.ThreeCardJExposureBook(this.tpData.mid, null);
  
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
  
            this.AndarBaharExposureBook(this.tpData.mid, null);
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
  openTpBetSlip(event: any, backlay: string, odds: string, runnerName: string, runnerId: number, gameId: number, gameType: number, runnerIndex: any, card: any) {
    console.log(event, backlay, odds, runnerName, runnerId, gameId, gameType, runnerIndex, card);

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
  Lucky7ExposureBook(gameId: number, state: any) {
    if (gameId == 0) {
      return;
    }
    if (state != undefined) {
      this.betsService.Lucky7ExposureBook(gameId).subscribe((data: any) => {
        this.GetRecentGameResult();
        let tpExposure = data.data;
        this.displayExposure(tpExposure, gameId);
        localStorage.setItem("Lucky7Expo_" + gameId, JSON.stringify(tpExposure));
      });
    } else {
      let tpExposure: any;
      tpExposure = localStorage.getItem("Lucky7Expo_" + gameId);
      if (!tpExposure) {
        this.Lucky7ExposureBook(gameId, "1");
      }
      else {
        tpExposure = JSON.parse(tpExposure);
        this.displayExposure(tpExposure, gameId);
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

  AndarBaharExposureBook(gameId: number, state: any) {
    if (gameId == 0) {
      return;
    }
    if (state != undefined) {
      this.betsService.AndarBaharExposureBook(gameId).subscribe((data: any) => {
        this.GetRecentGameResult();
        let tpExposure = data.data;
        this.displayExposure(tpExposure, gameId);
        localStorage.setItem("AndarBaharExpo_" + gameId, JSON.stringify(tpExposure));
      });
    } else {
      let tpExposure: any;
      tpExposure = localStorage.getItem("AndarBaharExpo_" + gameId);
      if (!tpExposure) {
        this.AndarBaharExposureBook(gameId, "1");
        return;
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
    (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
      this.teenpattiSubscription.unsubscribe();
  }
  openBet() {
    document.getElementById("mybet").style.width = "100%";
    
  }
  
  closebet() {
    document.getElementById("mybet").style.width = "0";
  }
  trackByIndex(index: number) {
    return index;
  }

}

