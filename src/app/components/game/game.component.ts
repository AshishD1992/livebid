import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../../services/auth.service';
import { Match } from '../../shared/models/match.model';
import { SportsDataById } from '../../shared/models/sports-data-by-id';
import { SharedataService } from '../../services/sharedata.service';
import { HomeMarket } from '../../models/home-market';
import { BookMakingData } from '../../models/book-making-data.model';
import { FancyData } from '../../models/fancy-data.model';
import { BetsService } from '../../service/bets.service';
import { BetDataModel } from '../../models/bet-data.model';
import { ShareBetDataService } from '../../services/share-bet-data.service';
import { MatchOddsSignalRService } from '../../services/signalr/match-odds.signalr';
import { DataService } from '../../services/data.service';
import { HubAddress } from '../../models/hub-address.model';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { FancySignalRService } from '../../services/signalr/fancy.signalr';
import { DataFormatService } from '../../services/data-format.service';
import { ReportService } from '../../services/report.service';
import * as _ from 'lodash';

export const BET_TYPES = { MATCH_ODDS: 1, BOOK_MAKING: 2, FANCY: 3 };
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  bodyElement: any;
  matchedbets: any;

  sportBfId!: number | null;
  sportId!: number | null;
  tourBfId!: number | null;
  tourId!: number | null;
  matchId!: number | null;
  marketId!: number | null;
  matchBfId!: string | null;
  marketBfId!: string | null;
  isLoggedIn: boolean = false;
  subSink!: Subscription;
  bmExposure!: any;
  homeSettings!: {
    betDelay: string;
    maxProfit: string;
    maxStake: string;
    minStake: string;
  };
  homeStatus!: string;
  tvConfig!: {
    channelIp: string;
    channelNo: number;
    hdmi: string;
    program: string;
  };
  currentEventData!: Match;
  fancyHubAddress!: string;
  marketHubAddress!: string;

  allMarketsData!: SportsDataById;
  homeCommentary!: string;
  homeDataMode!: number;
  homeDisplayApplication!: number;
  homeHasFancy!: number;
  homeInPlay!: number;
  homeStartDate!: string;
  homeMarkets!: HomeMarket[];
  sportName!: string;
  tournamentName: any;
  tournamentlist!: any;
  matchName!: string;
  homeOddsType!: number;
  currentEventSub!: Subscription;
  bookMakingData!: BookMakingData[];
  homeFancyData!: FancyData[];
  getHubAddressCalled!: boolean;
  date: any;
  isOddhighEnabled!: string;
  highlightOdds!: boolean;
  curTime!: any;
  fancyExposure!: any;
  sportradar_url!: any | null;
  tourname: any;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private betsService: BetsService,
    private betService: BetsService,
    private dataFormat: DataFormatService,
    private shareData: SharedataService,
    private shareBetData: ShareBetDataService,
    private sanitizer: DomSanitizer,
    private deviceInfo: DeviceDetectorService,
    private matchOddsSignalR: MatchOddsSignalRService,
    private dataService: DataService,
    private fancySignalR: FancySignalRService,
    private reportservice: ReportService,
  ) {

    // this.auth.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
    //   this.isLoggedIn = isLoggedIn;
    // });

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.sportBfId = +this.route.snapshot.paramMap.get('sportBfId')!;
      this.sportId = +this.route.snapshot.paramMap.get('sportId')!;
      this.tourBfId = +this.route.snapshot.paramMap.get('tourBfId')!;
      this.tourId = +this.route.snapshot.paramMap.get('tourId')!;
      this.matchBfId = this.route.snapshot.paramMap.get('matchBfId');
      this.matchId = +this.route.snapshot.paramMap.get('matchId')!;
      this.marketId = +this.route.snapshot.paramMap.get('marketId')!;
      this.marketBfId = this.route.snapshot.paramMap.get('marketBfId');
      // if (this.sportBfId === 4) {
      //   let MatchScoreHubAddress = "http://178.238.236.221:13681";
      //   this.score.MatchScoreSignalr(MatchScoreHubAddress, this.matchBfId);
      // } else if (this.sportBfId === 2) {
      //   let MatchScoreHubAddress = "http://178.238.236.221:13683";
      //   this.score.MatchScoreSignalr(MatchScoreHubAddress, this.matchBfId);
      // } else if (this.sportBfId === 1) {
      //   let MatchScoreHubAddress = "http://178.238.236.221:13684";
      //   this.score.MatchScoreSignalr(MatchScoreHubAddress, this.matchBfId);
      // }
      if (this.subSink) {
        this.subSink.unsubscribe();
      }
      this.subSink = new Subscription();
      // this.shareData.userData$.pipe(take(1)).subscribe((userData) => {
      //   try {
      //     this.currentEventData = this.dataFormat.sportsDataById(
      //       userData!.sportsData
      //     )[this.sportBfId!].tournaments[this.tourBfId!].matches[this.matchId!];
      //     this.updateSidebar.shareEventData({ sporId: this.sportId!, tourId: this.tourId!, matchId: this.matchId! })
      //     // console.log(this.currentEventData);
      //   } catch (error) { }
      // });
      this.allMKTdata();
      this.exposure();
      this.fancyExposureAll();

    });

    this.GetCurrentBets();
    this.bodyElement = document.querySelector('body');
  }


  allMKTdata() {
    this.getHubAddressCalled = false;
    this.currentEventSub = this.shareData.userData$.subscribe((userData) => {
      try {
        this.allMarketsData = this.dataFormat.sportsDataById(
          userData!.sportsData
        );
        // console.log(this.allMarketsData);
        this.currentEventData = this.dataFormat.sportsDataById(
          userData!.sportsData
        )[this.sportBfId!].tournaments[this.tourBfId!].matches[this.matchId!];
        console.log(this.currentEventData);
        this.shareBetData.shareCurrentTvSetting({ matchBfId: this.currentEventData.bfId, videoEnabled: this.currentEventData.videoEnabled });

        this.bookMakingData = this.currentEventData.bookRates;
        this.homeCommentary = this.currentEventData.commentary;
        this.homeDataMode = this.currentEventData.dataMode;
        this.homeDisplayApplication = this.currentEventData.displayApplication;
        this.homeFancyData = this.currentEventData.fancyData;
        this.homeHasFancy = this.currentEventData.hasFancy;
        this.homeInPlay = this.currentEventData.inPlay;
        this.homeStartDate = this.currentEventData.startDate;
        this.date = this.homeStartDate.split(" ");
        this.homeMarkets = this.dataFormat.marketsWise(
          this.currentEventData.markets
        );
        this.sportName = this.allMarketsData[this.sportBfId!].name;
        this.tourname = this.allMarketsData[this.sportBfId!].tournaments[this.tourBfId!].name;
        // console.log(this.tourname);
        this.tournamentName = this.allMarketsData[this.sportBfId!].tournaments[this.tourBfId!].matches
        this.tournamentlist = Object.keys(this.tournamentName).map(x => { return { key: x, value: this.tournamentName[x] } });
        // console.log(userData.sportsData);
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
          this.openMatchDateTime(this.homeStartDate);
          this.GetScoreId(this.currentEventData);
          // this.getBFScore(this.currentEventData);
          this.currentEventSub.unsubscribe();

          _.forEach(this.homeMarkets, (item2) => {
            this.ExposureBook(item2);
          })
        }

        this.shareData.shareMatchId(this.matchId!);
        // this.sharedata.shareTvConfig({ tvConfig: this.tvConfig, mtBfId: this.mtBfId });
      } catch (e) { }
    });
    this.subSink.add(this.currentEventSub);
  }
  getHubAddress() {
    this.subSink.add(
      this.dataService
        .getHubAddress(this.marketId!)
        .subscribe((res: HubAddress) => {
          console.log(res)
          this.fancyHubAddress = res.fancyHubAddress;
          this.marketHubAddress = res.hubAddress;

          if (this.marketHubAddress != null && this.marketHubAddress !== '' && this.homeDataMode == 1) {
            this.matchOddsSignalR.connectMarket(
              this.marketHubAddress,
              this.homeMarkets

            );
            this.marketSignalRData();
            
          }
          if (this.fancyHubAddress != null && this.fancyHubAddress !== '' && this.sportBfId === 4) {
            this.fancySignalR.connectFancy(this.fancyHubAddress, this.matchId!);
            this.fancySignalrData();
          }
          if (this.bookMakingData && this.bookMakingData.length != 0) {
            this.bookMakingData.forEach((bookMaking, index) => {
              this.getBmExposureBook(bookMaking);
              // this.betsService
              //   .getBmExposureBook(this.marketId!, bookMaking.id)
              //   .subscribe((data: any) => {
              //     if (data != null) {
              //       console.log(data);
              //       this.bmExposure = data.data;
              //       localStorage.setItem(
              //         'BMExpo_' + bookMaking.id,
              //         JSON.stringify(data.data)
              //       );
              //     }
              //   });
            });
          }
          // this.scorecardresponse()
        })
    );
    this.subSink.add(
      // this.settingService.GetSettings().subscribe((resp: SettingsModel) => {
      //   this.settingsData = resp;
      // })
    );
  }

  marketSignalRData() {
    let marketOddsSub = this.matchOddsSignalR.marketsData$.subscribe(
      (runner) => {
        if (runner != null) {
          this.currentEventSub.unsubscribe();
          let marketIndex = this.homeMarkets.findIndex((o) => {
            return o.bfId == runner.marketid;
          });
          this.isOddhighEnabled = localStorage.getItem('isOddHigh')!;
          if (marketIndex > -1) {
            // this.selectionId = runner.marketid
            //   .replace(/[^a-z0-9\s]/gi, '')
            //   .replace(/[_\s]/g, '_');
            let mktRunnerData = this.homeMarkets[marketIndex].runnerData;
            // this.noSpaceMarketid = runner.marketid
            //   .replace(/[^a-z0-9\s]/gi, '')
            //   .replace(/[_\s]/g, '_');
            // var txt = runner.runner
            //   .replace(/[^a-z0-9\s]/gi, '')
            // .replace(/[_\s]/g, '_');
            mktRunnerData.forEach((item: any, index: number) => {
              if (item.runnerName == runner.runner) {
                // this.oldrunnerData = MktRunnerData[index];
                this.homeMarkets[marketIndex].runnerData[index] = runner;
                this.homeMarkets[marketIndex].runnerData[index]['runnerName'] =
                  runner.runner;
                this.homeMarkets[marketIndex].runnerData[index]['status'] =
                  runner.runnerStatus;
                // this.isoddhigh = localStorage.getItem('Highlightodds');
                if (this.isOddhighEnabled === '1') {
                  this.highlightOdds = true;
                } else {
                  this.highlightOdds = false;
                }
              }
            });
          }
        }
      }
    );
    this.subSink.add(marketOddsSub);
    this.subSink.add(() => {
      this.matchOddsSignalR.UnsuscribeMarkets(this.homeMarkets);
    });
  }
  ShowBetMenu() {

    $('body').addClass('menu-is-toggledddd');
    $('.mybets').addClass('active');

  }
  fancySignalrData() {
    let fancySignalRSub = this.fancySignalR.fancyData$.subscribe((fancy) => {
      if (fancy != null) {
        this.currentEventSub.unsubscribe();
        this.curTime = fancy.curTime;
        this.bookMakingData = fancy.bookRates;
        // console.log("fancy",fancy);
        this.homeFancyData = fancy.data;
        if (this.bookMakingData.length != 0) {
          this.bookMakingData.forEach((bookMaking: BookMakingData, index) => {
            // bookMaking.oldPnl = this.bmExposure;
            let pnl = <any>(
              JSON.parse(localStorage.getItem(`BMExpo_${bookMaking.id}`)!)
            );
            if (pnl) {
              bookMaking['oldPnl'] = pnl;

            }
            else {
              this.getBmExposureBook(bookMaking);
            }
          });
        }
        this.homeFancyData.forEach((fancyData: FancyData, index) => {
          // this.bookrunnerData = item.runnerData;
          if (this.fancyExposure != null && this.fancyExposure != undefined) {
            let fancyExpo = this.fancyExposure![fancyData.name];
            // console.log(fancyExpo);
            if (fancyExpo != undefined) {
              fancyData.oldPnl = fancyExpo;
            }
          }
        });

      }
    });

    this.subSink.add(fancySignalRSub);
    this.subSink.add(() => {
      this.fancySignalR.UnsuscribeFancy(this.matchId!.toString());
    });
  }

  exposure() {
    this.shareBetData.exposure$.subscribe(data => {
      // console.log(data)
      try {
        if (!data.bookId && !data.gameId) {
          _.forEach(this.homeMarkets, (item2) => {
            if (item2.id = data.marketId) {
              this.ExposureBook(item2);
            }
          })
        }
        else if (data.bookId) {
          _.forEach(this.bookMakingData, (item2) => {
            if (item2.id = data.bookId) {
              this.getBmExposureBook(item2);
            }
          })
        }
      } catch { }
    })
  }
  fancyExposureAll() {
    this.shareData.fancyExposure$.subscribe(data => {
      console.log(data)
      try {
        this.fancyExposure = data;
      } catch { }
    })
  }


  ExposureBook(market: any) {
    this.betService.ExposureBook(market.id).subscribe((resp: any) => {
      market['pnl'] = resp.data;
      // console.log(market);
    }, err => {
    })
  }
  getBmExposureBook(bookMaking: any) {
    this.betService.getBmExposureBook(this.marketId, bookMaking.id).subscribe((resp: any) => {
      localStorage.setItem(
        'BMExpo_' + bookMaking.id,
        JSON.stringify(resp.data)
      );
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

  openMarketBetslip(
    event: Event,
    backLay: 'Back' | 'Lay',
    odds: string,
    runnerName: string,
    sportId: number,
    matchBfId: string,
    matchId: number,
    marketId: string,
    marketBfId: string
  ) {

    let moBetData = new BetDataModel();
    moBetData.backlay = backLay;
    moBetData.odds = odds;
    moBetData.runnerName = runnerName;
    moBetData.sportId = sportId;
    moBetData.matchBfId = matchBfId;
    moBetData.matchId = matchId;
    moBetData.marketId = marketId;
    moBetData.bfId = marketBfId;
    // c.stake = this.settingsData.defaultStake.toString();

    moBetData.stake = "0";
    moBetData.profit = (0).toFixed(2);
    moBetData.betType = BET_TYPES.MATCH_ODDS;
    moBetData.source = 'Mobile';
    moBetData.info = `device: ${this.deviceInfo.device}, os: ${this.deviceInfo.os}, os_version: ${this.deviceInfo.os_version}, browser: ${this.deviceInfo.browser}, browser_version: ${this.deviceInfo.browser_version}`;

    console.log(moBetData);
    this.shareBetData.shareBetsData(moBetData);
  }

  openBookBetSlip(
    event: Event,
    backLay: 'Back' | 'Lay',
    bookId: number,
    eventId: number,
    mktname: string,
    odds: string,
    runnerId: number,
    runnerName: string
  ) {

    let bmBetData = new BetDataModel();
    bmBetData.backlay = backLay;
    bmBetData.bookId = bookId;
    bmBetData.eventId = eventId;
    bmBetData.mktname = mktname;
    bmBetData.odds = odds;
    bmBetData.runnerId = runnerId;
    bmBetData.runnerName = runnerName;
    bmBetData.profit = (0).toString();
    // bmBetData.stake = this.settingsData.defaultStake.toString();
    bmBetData.stake = "0";
    bmBetData.betType = BET_TYPES.BOOK_MAKING;
    bmBetData.info =
      'device:' +
      this.deviceInfo.device +
      ', os:' +
      this.deviceInfo.os +
      ', os_version:' +
      this.deviceInfo.os_version +
      ', browser:' +
      this.deviceInfo.browser +
      ', browser_version:' +
      this.deviceInfo.browser_version;
    bmBetData.source = 'Mobile';
    console.log(bmBetData);
    this.shareBetData.shareBetsData(bmBetData);
  }

  openFancyBetSlip(
    event: Event,
    yesNo: 'Yes' | 'No',
    score: string,
    rate: string,
    runnerName: string,
    fancyId: number,
    matchBfId: string,
    matchId: number,
    mktBfId: string
  ) {

    let fancybetData = new BetDataModel();
    fancybetData.matchId = matchId;
    fancybetData.mktBfId = mktBfId;
    fancybetData.matchBfId = matchBfId;
    fancybetData.rate = rate;
    fancybetData.runnerName = runnerName;
    fancybetData.fancyId = fancyId;
    fancybetData.yesno = yesNo
    fancybetData.score = score;
    // fancybetData.stake = this.settingsData.defaultStake.toString();
    fancybetData.stake = "0";

    fancybetData.yesNo = yesNo;
    fancybetData.profit = (0).toFixed(2);
    fancybetData.betType = BET_TYPES.FANCY;
    fancybetData.source = 'Mobile';
    fancybetData.info =
      'device:' +
      this.deviceInfo.device +
      ', os:' +
      this.deviceInfo.os +
      ', os_version:' +
      this.deviceInfo.os_version +
      ', browser:' +
      this.deviceInfo.browser +
      ', browser_version:' +
      this.deviceInfo.browser_version;
    console.log(fancybetData);
    this.shareBetData.shareBetsData(fancybetData);
  }

  el(id: string) {
    return <HTMLElement>document.querySelector(id)!;
  }
  openMatchDateTime(matchDate) {
    let countDownClock = "";
    // if(this.currTime)
    let matchDate1 = new Date(matchDate)
    let currTime = new Date(this.curTime);

    let dateTime = matchDate1.getTime() - currTime.getTime();
    let day = Math.floor(dateTime / (1000 * 3600 * 24));
    // console.log('day '+day)
    let hrs = (Math.floor(dateTime / (1000 * 3600)) - (day * 24));
    // console.log('hrs '+hrs)
    // console.log('minutes '+parseInt(dateTime/(1000 * 60)))
    let minutes = (Math.floor(dateTime / (1000 * 60)) - ((day * 24 * 60) + (hrs * 60)));
    // console.log('minutes '+minutes)
    var seconds = (Math.floor(dateTime / (1000)) - ((day * 24 * 3600) + (hrs * 3600) + (minutes * 60)));
    // console.log('seconds '+seconds)
    // $scope.countDownClock = day + 'd ' + hrs + 'h ' + minutes + 'm ' + seconds + 's';
    return countDownClock = day + 'd ' + hrs + 'h ' + minutes + 'm ' + seconds + 's';
  }
  GetScoreId(event) {
    if (event.sportId == 4) {
      this.dataService.GetScoreId(event.bfId).subscribe(resp => {
        if (resp.scoreId != 0) {
          let url = 'https://shivexch.com/sport_score_api/cricketscore/index.html?scoreId=' + resp.scoreId + '&matchDate=' + event.matchDate;

          event['sportradar_url'] = url;
          this.sportradar_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentEventData.sportradar_url)
          console.log(this.sportradar_url);
        }

      })
    }

  }

  getBFScore(event) {
    // let favEventIds = JSON.parse(this.dfService.GetFavourites()).toString();
    if ((event.sportId == 4 && !event.sportradar_url) || event.sportId == 2) {
      this.dataService.getBFCricScore(event.bfId).subscribe(resp => {
        _.forEach(resp, (score) => {
          if (event.bfId == score.eventId) {
            event['fullScore'] = score;
          }
        });
      })
    }
    else if (event.sportId == 1) {
      this.dataService.getBFSTScore(event.bfId).subscribe(resp => {
        _.forEach(resp, (score) => {
          if (event.bfId == score.eventId) {
            event['fullScore'] = score;
          }
        });
      })
    }
  }

  scoreRun(fullScore) {
    var displayRun = "";
    if (fullScore.stateOfBall != undefined) {
      if (fullScore.stateOfBall.appealTypeName == "Not Out") {
        if (fullScore.stateOfBall.dismissalTypeName == "Not Out") {
          if (fullScore.stateOfBall.bye != "0") {
            return (displayRun =
              fullScore.stateOfBall.bye + " Run (Bye)");
          }
          if (fullScore.stateOfBall.legBye != "0") {
            return (displayRun =
              fullScore.stateOfBall.legBye + " Run (Leg Bye)");
          }
          if (fullScore.stateOfBall.wide != "0") {
            return (displayRun =
              fullScore.stateOfBall.wide + " Run (Wide)");
          }
          if (fullScore.stateOfBall.noBall != "0") {
            return (displayRun =
              fullScore.stateOfBall.batsmanRuns + " Run (No Ball)");
          }
          if (fullScore.stateOfBall.batsmanRuns == "0") {
            return (displayRun = "No Run");
          } else if (fullScore.stateOfBall.batsmanRuns == "1") {
            return (displayRun =
              fullScore.stateOfBall.batsmanRuns + " Run");
          } else if (parseInt(fullScore.stateOfBall.batsmanRuns) > 1) {
            return (displayRun =
              fullScore.stateOfBall.batsmanRuns + " Runs");
          }
          // if (fullScore.stateOfBall.batsmanRuns=="0" && fullScore.stateOfBall.legBye=="0") {
          //  displayRun="No Run";
          // }
          // else if (fullScore.stateOfBall.batsmanRuns!="0" && fullScore.stateOfBall.legBye=="0") {
          //  displayRun=fullScore.stateOfBall.batsmanRuns+" Runs";
          // }
          // else if (fullScore.stateOfBall.batsmanRuns=="0" && fullScore.stateOfBall.legBye!="0") {
          //  displayRun=fullScore.stateOfBall.legBye+" Runs (Leg Bye)";
          // }
        } else {
          return (displayRun =
            "WICKET (" + fullScore.stateOfBall.dismissalTypeName + ")");
        }
      } else {
        if (fullScore.stateOfBall.outcomeId == "0") {
          return (displayRun =
            "Appeal : " + fullScore.stateOfBall.appealTypeName);
        } else {
          return (displayRun = "WICKET (Not Out)");
        }
      }
    }

    // return displayRun;
  };

  getCardTeam(card, team) {
    if (card == "Goal" && team == "home") {
      return "ball-soccer team-a";
    } else if (card == "YellowCard" && team == "home") {
      return "card-yellow team-a";
    } else if (card == "Goal" && team == "away") {
      return "ball-soccer team-b";
    } else if (card == "YellowCard" && team == "away") {
      return "card-yellow team-b";
    }
    // else if (card=="SecondHalfKickOff") {
    //  return 'ball-soccer team-a';
    // }
    else if (card <= 10) {
      return 1;
    } else if (card <= 20) {
      return 2;
    } else if (card <= 30) {
      return 3;
    } else if (card <= 40) {
      return 4;
    } else if (card <= 50) {
      return 5;
    } else if (card <= 60) {
      return 6;
    } else if (card <= 70) {
      return 7;
    } else if (card <= 80) {
      return 8;
    } else if (card <= 90) {
      return 9;
    } else if (card <= 100) {
      return 10;
    }
  };

  trackById(idx: number, item: any) {
    return item.id;
  }

  GetCurrentBets() {
    this.reportservice.GetCurrentBets().subscribe(data => {
      this.matchedbets = data.matchedbets;
    })
  }
  ngAfterViewInit() {
    (this.bodyElement as HTMLElement).classList.add('clsbetshow');
  }

  // ngOnDestroy() {
  //   (this.bodyElement as HTMLElement).classList.remove('clsbetshow');
  // }


  openBet() {
    document.getElementById("mybet").style.width = "100%";
  }

  closebet() {
    document.getElementById("mybet").style.width = "0";
  }
  ngOnDestroy() {
    this.subSink.unsubscribe();
    this.shareData.shareMatchId(0);
  }

}
