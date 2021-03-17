import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Highlight } from '../shared/models/highlight';
import { Market } from '../shared/models/market';
import { Sport } from '../shared/models/sport.model';
import { SportsData } from '../shared/models/sports-data';
import * as _ from 'lodash';
import { data } from 'jquery';
import { SportsDataById } from '../shared/models/sports-data-by-id';
import { HomeMarket } from '../models/home-market';
import { getTpType } from '../helpers/get-game-type';
import { customDateFormat } from '../helpers/custom-date-format';
import { checkBettingEnable } from '../helpers/check-betting-enabled';

let UserSettingData;
@Injectable({
  providedIn: 'root',
})
export class DataFormatService {
  private _currentNavigationSub = new BehaviorSubject<any>(null);
  navigation$ = this._currentNavigationSub.asObservable();

  private _currentEventSub= new BehaviorSubject<Sport[] | null>(null);
  eventsdata$ = this._currentEventSub.asObservable();

  private  _currentDateTime = new BehaviorSubject<any>(null);
  _currentDateTimeSource = this._currentDateTime.asObservable();

  private _currentNewsSub = new BehaviorSubject<any>(null);
  news$ = this._currentNewsSub.asObservable();

  _currentUserDescription = <BehaviorSubject<any>>new BehaviorSubject(null);
  userDescriptionSource$ = this._currentUserDescription.asObservable();

  _currentUserSetting = <BehaviorSubject<any>>new BehaviorSubject(null);
    userSettingSource$ = this._currentUserSetting.asObservable();

    _betStakeSource = <BehaviorSubject<any>>new BehaviorSubject(null);
    currentBetStake$ = this._betStakeSource.asObservable();

    _fundsSource= <BehaviorSubject<any>>new BehaviorSubject(null);
    currentFunds = this._fundsSource.asObservable();

    _allMatchUnmatchBetsSource= new BehaviorSubject<any>(null);
  currentAllMatchUnmatchBets$ = this._allMatchUnmatchBetsSource.asObservable();

  _currentFancyExposure = new BehaviorSubject<any>(null);
  fancyExposureSource$ = this._currentFancyExposure.asObservable();

  constructor() { }

  shareNavigationData(data: any) {
    // this.currentNavigation.next()
    this._currentNavigationSub.next(data);
  }

  shareEventData(data:any){
    this._currentEventSub.next(data);
  }

  shareNews(data: any) {
    this._currentNewsSub.next(data);
  }

  shareDateTime(date: Date) {
    this._currentDateTime.next(date);
  }
  shareBetStake(data: any) {
    this._betStakeSource.next(data);
  }
  shareFunds(data: any) {
    this._fundsSource.next(data);
  }
  shareUserSetting(data: any) {
    this._currentUserSetting.next(data);
    UserSettingData = data;
  }

  shareUserDescription(data: any) {
    this._currentUserDescription.next(data);
  }
  shareFancyExposure(data: any) {
    this._currentFancyExposure.next(data);
  }
  shareAllMatchUnmatchBetsData(data: any) {
    this._allMatchUnmatchBetsSource.next(data);
  }

  sportsDataById(sportsData: SportsData): SportsDataById {
    let sportObj: any = {};
    sportsData.forEach((sport) => {
      let tourObj: any = {};
      sport.tournaments.forEach((tour) => {
        let matchObj: any = {};
        tour.matches.forEach((match) => {
          let marketObj: any = {};
          match.markets.forEach((market) => {
            marketObj[market.id] = market;
          });

          let videoEnabled = false;
          if (match.tvConfig != null) {
            if (match.tvConfig.channelIp != null) {
              videoEnabled = true;
            }
          }

          match['videoEnabled'] = videoEnabled;
          match['matchDate'] = this.customDateFormat(match.startDate);
          match['sportId'] = sport.bfId;
          match['sportName'] = sport.name;
          match['tourId'] = tour.bfId;
          match['sportradar_url']='';
          matchObj[match.id] = match;
        });
        tourObj[tour.bfId] = {
          bfId: tour.bfId,
          id: tour.id,
          name: tour.name,
          matches: matchObj,
        };
      });
      sportObj[sport.bfId] = {
        bfId: sport.bfId,
        id: sport.id,
        name: sport.name,
        tournaments: tourObj,
      };
    });
    return sportObj;
  }
  homeSignalrFormat = function (sport: Sport) {
    var sportDataFormat = new Map<any, any>();
    sport.forEach((tour: Map<any, any>) => {
      let tourDataFormat = new Map<any, any>();
      tour.forEach((match: Map<any, any>) => {
        let matchesDataFormat = new Map<any, any>();
        match.forEach((market: Map<any, any>) => {
          let marketsDataFormat = new Map<any, any>();
          market.forEach((market: Map<any, any>) => {
            marketsDataFormat.set(market.get('id'), market);
          });
          matchesDataFormat.set(match.get('bfId'), match);
        });
        tourDataFormat.set(tour.get('bfId'), {
          bfId: tour.get('bfId'),
          id: tour.get('id'),
          name: tour.get('name'),
          matches: matchesDataFormat,
        });
      });
    });
    return sportDataFormat;
  };

  customDateFormat(date) {
    var splitdate = date.split('-');
    var splitdate2 = splitdate[2].split(' ');
    if (splitdate[1] == "Jan") {
      date = splitdate2[0] + '-01-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Feb") {
      date = splitdate2[0] + '-02-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Mar") {
      date = splitdate2[0] + '-03-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Apr") {
      date = splitdate2[0] + '-04-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "May") {
      date = splitdate2[0] + '-05-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Jun") {
      date = splitdate2[0] + '-06-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Jul") {
      date = splitdate2[0] + '-07-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Aug") {
      date = splitdate2[0] + '-08-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Sept") {
      date = splitdate2[0] + '-09-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Oct") {
      date = splitdate2[0] + '-10-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Nov") {
      date = splitdate2[0] + '-11-' + splitdate[0] + ' ' + splitdate2[1]
    } else if (splitdate[1] == "Dec") {
      date = splitdate2[0] + '-12-' + splitdate[0] + ' ' + splitdate2[1]
    } else {
      date = splitdate2[0] + '-' + splitdate[1] + '-' + splitdate[0] + ' ' + splitdate2[1]
    }
    return date.replace(/ /g, "T");
  }

  NavigationFormat(sportsData, curTime) {
    // console.log(sportsData)

    let indexTennis = sportsData.findIndex((sport) => {
      return sport.name == "Tennis";
    }
    );
    if (indexTennis == -1) {
      var data = {};
      data['bfId'] = '2';
      data['name'] = 'Tennis';
      data['id'] = '2';
      data['tournaments'] = [];
      sportsData.push(data);
    }
    let indexCricket = sportsData.findIndex((sport) => {
      return sport.name == "Cricket";
    }
    );
    if (indexCricket == -1) {
      var data = {};
      data['bfId'] = '4';
      data['name'] = 'Cricket';
      data['id'] = '1';
      data['tournaments'] = [];
      sportsData.push(data);
    }
    let indexSoccer = sportsData.findIndex((sport) => {
      return sport.name == "Soccer";
    }
    );
    if (indexSoccer == -1) {
      var data = {};
      data['bfId'] = '1';
      data['name'] = 'Soccer';
      data['id'] = '3';
      data['tournaments'] = [];
      sportsData.push(data);
    }

    var sportDataFormat = {};
    sportsData.forEach(function (item, index) {
      if (item.bfId == 4) {
        item['sortId'] = 1;
      }
      if (item.bfId == 2) {
        item['sortId'] = 2;
      }
      if (item.bfId == 1) {
        item['sortId'] = 3;
      }
      if (item.bfId == 51) {
        item['sortId'] = 4;
      }
      var tourDataFormat = {};
      item.tournaments.forEach(function (item2, index2) {
        var matchesDataFormat = {};
        item2.matches.forEach(function (item3, index3) {
          // var marketsDataFormat = {};

          let isVirtual = false;

          item3.markets.forEach(function (item4, index4) {
            var runnerarray = [];

            if (item4.bfId.indexOf('.') == -1) {
              isVirtual = true;
            }
            _.forEach(item4.runnerData1, function (runner, key) {
              if (runner.Key != undefined) {
                runnerarray.push(runner.Value);
              } else {
                runnerarray.push(runner);
              }
            });
            item4.status = item4.status.trim();
            item4['runners'] = runnerarray;
            // marketsDataFormat[item4.id] = item4;
          });
          item3['sportId'] = item.bfId;
          item3['sportName'] = item.name;
          item3['tourId'] = item2.bfId;
          item3['isInplay'] = item3.inPlay == 1 ? true : false;

          item3['isVirtual'] = isVirtual;

          if (item.bfId == 51) {
            item['isTeenpatti'] = true;
            item3['isTeenpatti'] = true;
            let tpGame = getTpType(item3.bfId);
            item3['gameName'] = tpGame.gameName;
            item3['gameType'] = tpGame.gameType;
          } else {
            item['isTeenpatti'] = false;
            item3['isTeenpatti'] = false;
          }


          if (!item3.bookRates) {
            item3['bookRates'] = [];
          }
          if (!item3.fancyData) {
            item3['fancyData'] = [];
            item3['hasFancy'] = 0;
          }

          if (item3.hasFancy == 1) {
            item3['isFancy'] = true;
          } else {
            item3['isFancy'] = false;
          }

          let videoEnabled = false;
          if (item3.tvConfig != null) {
            if (item3.tvConfig.channelIp != null) {
              videoEnabled = true;
            }
          }

          item3['videoEnabled'] = videoEnabled;

          item3['matchDate'] = customDateFormat(item3.startDate);
          item3['isBettable'] = checkBettingEnable(curTime, item3);

          if (UserSettingData) {
            if (UserSettingData[item3.sportId]) {
              item3['settings'] = UserSettingData[item3.sportId];
              item3['bmSettings'] = UserSettingData[1003];
            }
          }

          if (item3.bmSettings) {
            _.forEach(item3.bookRates, (bookItem) => {
              bookItem.minStake = item3.bmSettings.minStake;
              bookItem.maxStake = item3.bmSettings.maxStake;
              bookItem['maxProfit'] = item3.bmSettings.maxProfit;
            })
          }


          matchesDataFormat[item3.bfId] = item3;
        });
        tourDataFormat[item2.bfId] = {
          bfId: item2.bfId,
          id: item2.id,
          name: item2.name,
          matches: matchesDataFormat
        };
      });
      sportDataFormat[item.bfId] = {
        bfId: item.bfId,
        id: item.id,
        name: item.name,
        sortId: item.sortId,
        isTeenpatti: item.isTeenpatti,
        tournaments: tourDataFormat
      };
    });


    // console.log(sportDataFormat)

    return sportDataFormat;
  }

  navigationListFormat(sportsData: Sport[]): Sport[] {
    let navArray = new Array<Sport>();
    let sportDataFormat;
    sportsData.forEach((sport, index) => {
      sportDataFormat = new Sport();
      let tourDataFormat: any = [];
      sport.tournaments.forEach((tour) => {
        let matchesDataFormat: any = [];
        tour.matches.forEach((match) => {
          let marketsDataFormat: any = [];
          match.markets.forEach((market) => {
            marketsDataFormat.push(market);
          });
          if (match.fancyData) {
            match.fancyData.forEach((fancy) => {
              marketsDataFormat.push(fancy);
            });
          }
          if (match.bookRates) {
            match.bookRates.forEach((bookMaking) => {
              marketsDataFormat.push(bookMaking);
            });
          }
          matchesDataFormat.push({
            id: match.id,
            name: match.name,
            bfId: match.bfId,
            markets: marketsDataFormat,
          });
        });
        tourDataFormat.push({
          bfId: tour.bfId,
          id: tour.id,
          name: tour.name,
          matches: matchesDataFormat,
        });
      });
      Object.assign(sportDataFormat, {
        bfId: sport.bfId,
        id: sport.id,
        name: sport.name,
        tournaments: tourDataFormat,
      });
      navArray.push(sportDataFormat);
    });
    return navArray;
  }



  highlightwise1(sportsData: Sport) {
    var highlightData: any = [];
    if (!sportsData) {
      return highlightData;
    }
    sportsData.tournaments.forEach(function (tour) {
      tour.matches.forEach((match) => {
        match.markets.forEach((market) => {
          let highlight = Object.assign(new Highlight(), market);
          if (market.name == 'Match Odds') {
            highlight.sportId = sportsData.id;
            highlight.bfId = market.bfId;
            highlight.inPlay = match.inPlay;
            highlight.isBettingAllow = market.isBettingAllow;
            highlight.isMulti = market.isMulti;
            highlight.marketId = market.id;
            highlight.matchDate = match.startDate;
            highlight.matchId = match.id;
            highlight.matchBfId = match.bfId;
            highlight.matchName = match.name;
            highlight.sportName = sportsData.name;
            highlight.status = match.status;
            highlight.tourBfId = tour.bfId;
            highlight.tourId = tour.id;
            highlight.tourName = tour.name;
            highlight.sportBfId = sportsData.bfId;
            highlight.hasFancy = match.hasFancy;
            // highlight.settings = match.settings;
            highlight.hasBookMaker = match.bookRates
              ? match.bookRates.length
                ? 1
                : 0
              : 0;
            highlightData.push(highlight);
          }
        });
      });
    });
    return highlightData;
  }

  tournamentWise(sportsData: Sport) {
    var highlightData: any = [];
    if (!sportsData) {
      return highlightData;
    }
    sportsData.tournaments.forEach(function (tour) {
      tour.matches.forEach((match) => {
        match.markets.forEach((market) => {
          let highlight = Object.assign(new Highlight(), market);
          if (tour.id) {
            highlight.sportId = sportsData.id;
            highlight.bfId = market.bfId;
            highlight.inPlay = match.inPlay;
            highlight.isBettingAllow = market.isBettingAllow;
            highlight.isMulti = market.isMulti;
            highlight.marketId = market.id;
            highlight.matchDate = match.startDate;
            highlight.matchId = match.id;
            highlight.matchBfId = match.bfId;
            highlight.matchName = match.name;
            highlight.sportName = sportsData.name;
            highlight.status = match.status;
            highlight.tourBfId = tour.bfId;
            highlight.tourId = tour.id;
            highlight.tourName = tour.name;
            highlight.sportBfId = sportsData.bfId;
            highlight.hasFancy = match.hasFancy;
            // highlight.settings = match.settings;
            highlight.hasBookMaker = match.bookRates
              ? match.bookRates.length
                ? 1
                : 0
              : 0;
            highlightData.push(highlight);
          }
        });
      });
    });
    return highlightData;
  }
  //   tournamentWise(sportsTourList) {
  //   var tourData = [];
  //   if (!sportsTourList) {
  //     return tourData;
  //   }
  //   _.forEach(sportsTourList.tournaments, function (item, index) {
  //     let highlight = Object.assign(new Highlight());
  //           highlight.tourBfId = item.bfId;
  //           highlight.tourId = item.id;
  //           highlight.tourName = item.name;
  //           highlight.sportBfId = sportsTourList.bfId;

  //     tourData.push(highlight);
  //   });
  //   return tourData;
  // }

  nextEventsWise(sportsData: Sport) {
    var highlightData: any = [];
    if (!sportsData) {
      return highlightData;
    }
    sportsData.tournaments.forEach(function (tour) {
      tour.matches.forEach((match) => {
        match.markets.forEach((market) => {
          let highlight = Object.assign(new Highlight(), market);
          if (market.name == 'Match Odds') {
            highlight.sportId = sportsData.id;
            highlight.bfId = market.bfId;
            highlight.inPlay = match.inPlay;
            highlight.isBettingAllow = market.isBettingAllow;
            highlight.isMulti = market.isMulti;
            highlight.marketId = market.id;
            highlight.matchDate = match.startDate;
            highlight.matchId = match.id;
            highlight.matchBfId = match.bfId;
            highlight.matchName = match.name;
            highlight.sportName = sportsData.name;
            highlight.status = match.status;
            highlight.tourBfId = tour.bfId;
            highlight.tourId = tour.id;
            highlight.tourName = tour.name;
            highlight.sportBfId = sportsData.bfId;
            highlight.hasFancy = match.hasFancy;
            highlight.hasBookMaker = match.bookRates
              ? match.bookRates.length
                ? 1
                : 0
              : 0;
            if (match.inPlay == 0) {
              highlightData.push(highlight);
            }
          }
        });
      });
    });
    return highlightData;
  }

  inplaylistwise(sportsData: Sport) {
    var highlightData: Highlight[] = [];
    if (!sportsData) {
      return highlightData;
    }
    sportsData.tournaments.forEach(function (tour) {
      tour.matches.forEach((match) => {
        if (match.inPlay === 1) {
          match.markets.forEach((market) => {
            let highlight = Object.assign(new Highlight(), market);
            if (market.name == 'Match Odds') {
              highlight.bfId = market.bfId;
              highlight.inPlay = match.inPlay;
              highlight.isBettingAllow = market.isBettingAllow;
              highlight.isMulti = market.isMulti;
              highlight.marketId = market.id;
              highlight.matchDate = match.startDate;
              highlight.matchId = match.id;
              highlight.matchName = match.name;
              highlight.sportName = sportsData.name;
              highlight.status = match.status;
              highlight.matchBfId = match.bfId;
              highlight.tourBfId = tour.bfId;
              highlight.tourName = tour.name;
              highlight.sportBfId = sportsData.bfId;
              highlight.hasFancy = match.hasFancy;
            //   highlight.settings = match.settings;
              highlight.hasBookMaker = match.bookRates
                ? match.bookRates.length
                  ? 1
                  : 0
                : 0;
              highlightData.push(highlight);
            }
          });
        }
      });
    });
    return highlightData;
  }

  searchMatchWise(sportsData: any) {
    var matchesData: any[] = []
    if (sportsData == undefined) {
      return matchesData;
    }
    _.forEach(sportsData, function (item, index) {
      _.forEach(item.tournaments, function (item2, index2) {
        _.forEach(item2.matches, function (item3, index3) {
          _.forEach(item3.markets, function (item4, index4) {
            if (item4.name == "Match Odds") {
              item4.runnerData['bfId'] = item4.bfId;
              item4.runnerData['inPlay'] = item3.inPlay;
              item4.runnerData['dataMode'] = item3.dataMode;
              item4.runnerData['isBettingAllow'] = item4.isBettingAllow;
              item4.runnerData['isMulti'] = item4.isMulti;
              item4.runnerData['marketId'] = item4.id;
              item4.runnerData['matchDate'] = item3.startDate;
              item4.runnerData['matchId'] = item3.id;
              item4.runnerData['matchName'] = item3.name;
              item4.runnerData['sportName'] = item.name;
              item4.runnerData['sportId'] = item.id;
              item4.runnerData['sportBfId'] = item.bfId;

              item4.runnerData['status'] = item3.status;
              item4.runnerData['tourId'] = item2.id;
              item4.runnerData['tourBfId'] = item2.bfId;

              item4.runnerData['matchBfId'] = item3.bfId;
              item4.runnerData['sportID'] = item.bfId;
              matchesData.push(item4.runnerData);
            }
          })
        })
      })
    })
    return matchesData;
  }

  marketsWise(markets: Market[]) {
    let newMarkets: HomeMarket[] = [];
    markets.forEach((market) => {
      if (market.name.indexOf('Over Line') == -1) {
        let marketItem: any = {};
        let runnerarray: any[] = [];
        Object.entries(market.runnerData1).forEach(([runnerName, runner]) => {
          runnerarray.push(runner);
        });
        marketItem.runnerData = runnerarray;
        marketItem.mktId = market.id;
        marketItem.status = market.status.trim();
        marketItem.name = market.name;
        marketItem.bfId = market.bfId;
        marketItem.id = market.id;
        marketItem.isBettingAllow = market.isBettingAllow;
        marketItem.isMulti = market.isMulti;
        newMarkets.push(marketItem);
      }
    });
    return newMarkets;
  }

  sportEventWise(sportsData, isInplay) {

    var sportEventData = [];
    if (sportsData == undefined) {
      return sportEventData;
    }
    _.forEach(sportsData, function (item, index) {
      var data = {};
      var matchesData = [];
      _.forEach(item.tournaments, function (item2, index2) {
        _.forEach(item2.matches, function (item3, index3) {

          _.forEach(item3.markets, function (item4, index4) {
            if (item4.name == "Match Odds") {
              item4.runnerData['bfId'] = item4.bfId;
              item4.runnerData['inPlay'] = item3.inPlay;
              item4.runnerData['isVirtual'] = item3.isVirtual;
              item4.runnerData['isTeenpatti'] = item3.isTeenpatti;
              item4.runnerData['gameName'] = item3.gameName;
              item4.runnerData['gameType'] = item3.gameType;
              item4.runnerData['dataMode'] = item3.dataMode;
              item4.runnerData['isBettingAllow'] = item4.isBettingAllow;
              item4.runnerData['isMulti'] = item4.isMulti;
              item4.runnerData['marketId'] = item4.id;
              item4.runnerData['startDate'] = item3.startDate;
              item4.runnerData['matchDate'] = item3.matchDate;
              item4.runnerData['videoEnabled'] = item3.videoEnabled;
              item4.runnerData['isBettable'] = item3.isBettable;
              item4.runnerData['isFancy'] = item3.isFancy;
              item4.runnerData['matchId'] = item3.id;
              item4.runnerData['matchName'] = item3.name;
              item4.runnerData['sportName'] = item.name;
              item4.runnerData['sportId'] = item.bfId;
              item4.runnerData['status'] = item3.status;
              item4.runnerData['tourId'] = item2.bfId;
              item4.runnerData['mtBfId'] = item3.bfId;
              item4.runnerData['sportID'] = item.bfId;
              item4.runnerData['sptId'] = item.bfId;
              if (isInplay == 1 && item3.isInplay) {
                matchesData.push(item4.runnerData);
              }
              if (isInplay == 0) {
                matchesData.push(item4.runnerData);
              }

            }
          })
        })
      })
      data["id"] = item.bfId;
      data["name"] = item.name;
      data["ids"] = item.id;
      data['sortId'] = item.sortId;
      data['isTeenpatti'] = item.isTeenpatti;
      data["matches"] = matchesData;
      if (matchesData.length > 0 && isInplay == 1) {
        sportEventData.push(data);
      } else {
        sportEventData.push(data);
      }
    })

    sportEventData.sort(function (a, b) {
      return a.sortId - b.sortId;
    });

    // console.log(sportEventData)

    return sportEventData;
  }
  favouriteEventWise(sportsData) {
    let groupedEvents = []
    let favArray = localStorage.getItem('favourite');
    if (favArray != null) {
      favArray = JSON.parse(favArray);
      _.forEach(sportsData, function (item, index) {
        _.forEach(item.tournaments, function (item2, index2) {
          _.forEach(item2.matches, function (item3, index3) {
            // item3.markets.forEach(function (item4, index4) {
            //   var runnerarray = [];
            //   _.forEach(item4.runnerData1, function (runner, key) {
            //     if (runner.Key != undefined) {
            //       runnerarray.push(runner.Value);
            //     } else {
            //       runnerarray.push(runner);
            //     }
            //   });
            //   // delete item4.runnerData;
            //   item4['runners'] = runnerarray;
            // });
            let matchIndex = _.indexOf(favArray, item3.bfId);
            if (matchIndex > -1) {
              groupedEvents.push(item3);
            }
          })
        })
      })
    }

    return groupedEvents;
  }
  ToggleFavourite(mtBfId, remove) {
    let favourite = this.GetFavourites();;

    if (favourite == null) {
      let matchArray = [];
      matchArray.push(mtBfId)
      this.SetFavourites(matchArray);
    }
    else {
      let matchArray = JSON.parse(favourite);
      let matchIndex = _.indexOf(matchArray, mtBfId);
      if (matchIndex < 0) {
        matchArray.push(mtBfId)
        this.SetFavourites(matchArray);
      }
      else if (matchIndex > -1 && remove) {
        matchArray.splice(matchIndex, 1)
        this.SetFavourites(matchArray);
      }
    }
  }

  SetFavourites(matchArray) {
    localStorage.setItem('favourite', JSON.stringify(matchArray));
  }

  GetFavourites() {
    return localStorage.getItem('favourite');
  }

  RemoveFavourites() {
    localStorage.setItem('favourite', JSON.stringify([]));
  }
  matchUnmatchBetsFormat(matchBets) {
    // console.log(matchBets)
    let matchWiseData = {
      matchWiseBets: [],
      totalBets: 0
    }
    if (!matchBets) {
      return matchWiseData;
    }
    _.forEach(matchBets, (bet, betIndex) => {

      if (bet.backLay == 'YES') {
        bet.backLay = 'BACK';
      }
      if (bet.backLay == 'NO') {
        bet.backLay = 'LAY';
      }
      matchWiseData.totalBets++;
      if (bet.isFancy == 0) {
        bet['profit'] = (parseFloat(bet.odds) - 1) * bet.stake;
        bet['odds'] = parseFloat(bet.odds).toFixed(2);
      }
      if (bet.isFancy == 1) {

        if (bet.odds.indexOf('/') > -1) {
          bet['profit'] = (parseFloat(bet.odds.split('/')[1]) * bet.stake) / 100;
          // bet['odds'] = (bet.score) + '/' + (bet.odds);
        }
      }
      // console.log(bet.marketName)
      if (bet.isFancy == 2) {
        if (bet.marketName == "TO WIN THE TOSS") {
          bet['profit'] = (parseFloat(bet.odds) - 1) * bet.stake;
        }
        else {
          bet['profit'] = (parseFloat(bet.odds) / 100) * bet.stake;
        }
      }

      matchWiseData.matchWiseBets.push(bet);

    });

    // console.log(matchWiseData)

    return matchWiseData;

  }
}
