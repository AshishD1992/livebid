import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BetDataModel } from '../models/bet-data.model';
import { UserBet } from '../shared/models/user-bet';

@Injectable({
  providedIn: 'root',
})
export class ShareBetDataService {
  private _currentBetsSub = new BehaviorSubject<BetDataModel | null>(null);
  bets$ = this._currentBetsSub.asObservable();

  private _currentAllBetsSub = new BehaviorSubject<any>(null);
  allBets$ = this._currentAllBetsSub.asObservable();

  private _currentAllMatchUnmatchBetsSub = new BehaviorSubject<any>(null);
  allMatchUnmatchBets$ = this._currentAllMatchUnmatchBetsSub.asObservable();

  private _currentMatchedBetsSub = new BehaviorSubject<UserBet | null>(null);
  matchedBets$ = this._currentMatchedBetsSub.asObservable();

  private _currentExposureSub = new BehaviorSubject<any>(null);
  exposure$ = this._currentExposureSub.asObservable();

  private _currentFancyExposureSub = new BehaviorSubject<any>(null);
  fancyExposure$ = this._currentFancyExposureSub.asObservable();

  private _currentTvSettingSub = new BehaviorSubject<any>(null);
  currentTvSetting$ = this._currentTvSettingSub.asObservable();

  private _clearlBetSlipSub = new BehaviorSubject<any>(null);
  clearlBetSlip$ = this._clearlBetSlipSub.asObservable();

  constructor() {}

  shareBetsData(data: any) {
    this._currentBetsSub.next(data);
  }

  shareAllBetsData(data: any) {
    this._currentAllBetsSub.next(data);
  }

  shareAllMatchUnmatchBetsData(data: any) {
    this._currentAllMatchUnmatchBetsSub.next(data);
  }

  shareMatchedBetsData(data: any) {
    this._currentMatchedBetsSub.next(data);
  }

  shareExposure(data: any) {
    this._currentExposureSub.next(data);
  }

  shareFancyExposure(data: any) {
    this._currentFancyExposureSub.next(data);
  }
  shareCurrentTvSetting(data: any) {
    this._currentTvSettingSub.next(data);
  }
  shareClearlBetSlip(data: any) {
    this._clearlBetSlipSub.next(data);
  }
}
