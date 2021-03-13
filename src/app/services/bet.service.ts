import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BetsService {






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

  T20ExposureBook(GAMEID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/T20ExposureBook?gameid=${GAMEID}`)
  }
  Lucky7ExposureBook(GAMEID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/Lucky7ExposureBook?gameid=${GAMEID}`)
  }
  ThreeCardJExposureBook(GAMEID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/ThreeCardJExposureBook?gameid=${GAMEID}`)
  }
  AndarBaharExposureBook(GAMEID): Observable<any> {
    return this.http.get(`http://www.kingsbid.in/Bet/BetBuzzClient.svc/Bets/AndarBaharExposureBook?gameid=${GAMEID}`)
  }
}
