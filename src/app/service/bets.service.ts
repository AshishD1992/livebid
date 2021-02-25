import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';

import { PlaceMOBet } from "../models/place-mo-bet.model";
import { PlaceBMBet } from "../models/place-bm-bet.model"
import { PlaceFancyBet } from '../models/place-fancy-bet.modal';
@Injectable({
  providedIn: 'root'
})
export class BetsService {

  baseUrl = `${environment.betUrl}/Bets`;
  BASE_URL = `${environment.readUrl}/Data`;


  constructor(
    private httpClient: HttpClient
  ) { }

  getBmExposureBook(marketId: any, bookId: number) {
    return this.httpClient.get(`${this.baseUrl}/BMExposureBook?mktid=${marketId}&bid=${bookId}`)
  }
  ExposureBook(marketId: number) {
    return this.httpClient.get(`${this.baseUrl}/ExposureBook?mktid=${marketId}`)
  }
  Fancybook(MTID: number, FID: number) {
    return this.httpClient.get(`${this.baseUrl}/Fancybook?mtid=${MTID}&fid=${FID}`)
  }
  T20ExposureBook(gameid: number) {
    return this.httpClient.get(`${this.baseUrl}/T20ExposureBook?gameid=${gameid}`)
  }
  Lucky7ExposureBook(gameid: number) {
    return this.httpClient.get(`${this.baseUrl}/Lucky7ExposureBook?gameid=${gameid}`)
  }
  ThreeCardJExposureBook(gameid: number) {
    return this.httpClient.get(`${this.baseUrl}/ThreeCardJExposureBook?gameid=${gameid}`)
  }
  AndarBaharExposureBook(gameid: number) {
    return this.httpClient.get(`${this.baseUrl}/AndarBaharExposureBook?gameid=${gameid}`)
  }

  placeMoBet(placeBetData: PlaceMOBet) {
    return this.httpClient.post(`${this.baseUrl}/PlaceMOBet`, placeBetData);
  }
  PlaceBMBet(placeBMBetData: PlaceBMBet) {
    return this.httpClient.post(`${this.baseUrl}/PlaceBMBet`, placeBMBetData);
  }
  PlaceFancyBet(PlaceFancyBetData: PlaceFancyBet) {
    return this.httpClient.post(`${this.baseUrl}/PlaceFancyBet`, PlaceFancyBetData);
  }
  PlaceTpBet(PlaceTpBet:any) {
    // delete PlaceTpBet.betType;
    return this.httpClient.post(`${this.baseUrl}/PlaceTpBet`, PlaceTpBet);
  }
  getFund() {
    return this.httpClient.get(`${this.BASE_URL}/Fund`);
  }
}
