import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Navigation } from '@angular/router';
import { FundsData } from '../shared/models/funds-data';
import { UserData } from '../shared/models/user-data.model';
import { UserDescription } from '../shared/models/user-description';
import { UserBet } from '../shared/models/user-bet';
import { Match } from '../shared/models/match.model';

@Injectable({
  providedIn: 'root',
})
export class SharedataService {
  private _fundsSub = new BehaviorSubject<FundsData | null>(null);
  funds$ = this._fundsSub.asObservable();

  private _userDescriptionSub = new BehaviorSubject<UserDescription | null>(
    null
  );
  userDescription$ = this._userDescriptionSub.asObservable();

  private _userDataSub = new BehaviorSubject<UserData | null>(null);
  userData$ = this._userDataSub.asObservable();

  private _clientSignalrSub = new BehaviorSubject<any>(null);
  homesignalrData$ = this._clientSignalrSub.asObservable();

  private _currentMoExposureSub = new BehaviorSubject<any>(null);
  mOExposure$ = this._currentMoExposureSub.asObservable();

  private _currentBMExposureSub = new BehaviorSubject<any>(null);
  bMExposure$ = this._currentBMExposureSub.asObservable();

  private _currentFancyExposureSub = new BehaviorSubject<any>(null);
  fancyExposure$: Observable<
    any
  > = this._currentFancyExposureSub.asObservable();

  private _currentAllMatchUnmatchBetsSub = new BehaviorSubject<{
    _userAvgmatchedBets: {[key: number]: UserBet[]};
    _userMatchedBets: {[key: number]: UserBet[]};
    _userUnMatchedBets: {[key: number]: UserBet[]};
    _userTpBets: {[key: number]: UserBet[]};
  } | null>(null);
  allMatchUnmatchBets$ = this._currentAllMatchUnmatchBetsSub.asObservable();

  private _currentMatchedBetsSub = new BehaviorSubject<any>(null);
  matchedBets$ = this._currentMatchedBetsSub.asObservable();

  private _routeChangeSub = new BehaviorSubject<any>(null);
  routeChange$: Observable<Navigation> = this._routeChangeSub.asObservable();

  private _tvConfigSub: ReplaySubject<any> = new ReplaySubject<any>(1);
  tvConfig$ = this._tvConfigSub.asObservable();

  private _matchIdSub = new BehaviorSubject<number>(0);
  matchId$ = this._matchIdSub.asObservable();

  private _currentMatchSub = new BehaviorSubject<Match|null>(null);
  currentMatch$ = this._currentMatchSub.asObservable();

  private _cancelBetSlipSub = new BehaviorSubject<any>(null);
  cancelBetSlip$ = this._cancelBetSlipSub.asObservable();

  constructor() {}

  sharefundsdata(fundsData: FundsData) {
    this._fundsSub.next(fundsData);
  }
  shareuserdescriptiondata(data: any) {
    this._userDescriptionSub.next(data);
  }
  shareuserData(data: any) {
    this._userDataSub.next(data);
  }
  sharehomesignalrData(data: any) {
    this._clientSignalrSub.next(data);
  }
  shareMoExposure(data: any) {
    this._currentMoExposureSub.next(data);
  }
  shareBMExposure(data: any) {
    this._currentBMExposureSub.next(data);
  }
  shareFancyExposure(data: any) {
    this._currentFancyExposureSub.next(data);
  }
  shareAllMatchUnmatchBetsData(data: any) {
    this._currentAllMatchUnmatchBetsSub.next(data);
  }
  shareMatchedBetsData(data: any) {
    this._currentMatchedBetsSub.next(data);
  }

  shareRouteChangeData(data: any) {
    this._routeChangeSub.next(data);
  }

  shareTvConfig(data: any) {
    this._tvConfigSub.next(data);
  }

  shareMatchId(matchId: number) {
    this._matchIdSub.next(matchId);
  }

  shareCurrentMatch(data: Match) {
    this._currentMatchSub.next(data);
  }

  shareCancelBetSlip() {
    this._cancelBetSlipSub.next(null);
  }
}
