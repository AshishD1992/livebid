import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BetsService {
  baseUrl = `${environment.betUrl}/Bets`;
  BASE_URL = `${environment.readUrl}/Data`;

  constructor(private http: HttpClient) { }

  PlaceMOBet(data): Observable<any> {
    return this.http.post(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/PlaceMOBet`, data)
  }
  PlaceFancyBet(data): Observable<any> {
    return this.http.post(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/PlaceFancyBet`, data)
  }
  PlaceBookBet(data): Observable<any> {
    return this.http.post(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/PlaceBookBet`, data)
  }

  PlaceTpBet(data): Observable<any> {
    return this.http.post(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/PlaceTpBet`, data)
  }

  ExposureBook(MKTID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Read3/BetBuzzClient.svc/Bets/ExposureBook?mktid=${MKTID}`)
  }
  GetFancyExposure(MTID, FID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Read3/BetBuzzClient.svc/Bets/GetFancyExposure?mtid=${MTID}&fid=${FID}`)
  }
  BMExposureBook(MKTID, BID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Read3/BetBuzzClient.svc/Bets/BMExposureBook?mktid=${MKTID}&bid=${BID}`)
  }
  Fancybook(MTID, FID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Read3/BetBuzzClient.svc/Bets/Fancybook?mtid=${MTID}&fid=${FID}`)
  }

  T20ExposureBook(gameid: number) {
    return this.http.get(`${this.baseUrl}/T20ExposureBook?gameid=${gameid}`)
  }
  Lucky7ExposureBook(gameid: number) {
    return this.http.get(`${this.baseUrl}/Lucky7ExposureBook?gameid=${gameid}`)
  }
  ThreeCardJExposureBook(gameid: number) {
    return this.http.get(`${this.baseUrl}/ThreeCardJExposureBook?gameid=${gameid}`)
  }
  AndarBaharExposureBook(gameid: number) {
    return this.http.get(`${this.baseUrl}/AndarBaharExposureBook?gameid=${gameid}`)
  }
}
