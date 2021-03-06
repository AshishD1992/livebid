import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { data } from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  BASEURL = environment.betUrl;

  constructor(private http: HttpClient) { }



  AccountStatement(FROM: any, TO: any): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/AccountStatement?from=${FROM}&to=${TO}`);
  }

  MyMarket(): Observable<any> {
    return this.http.get(`${this.BASEURL}/Bets/MyMarket`);
  }

  GetBetHistory(FROM: any, TO: any, F: any): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/GetBetHistory?from=${FROM}&to=${TO}&f=${F}`);
  }
  ActivityLog(): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/ActivityLog`);
  }

  GetRecentGameResult(GAMETYPE: any): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/GetRecentGameResult?gametype=${GAMETYPE}`);
  }

  GetProfitLoss(FROM: any, TO: any): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/GetProfitLoss?from=${FROM}&to=${TO}`);
  }
  GetProfitLossfromAS(MTID, MKTID, TYPE): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/GetProfitLossfromAS?mtid=${MTID}&mktid=${MKTID}&type=${TYPE}`);
  }
  GetCaisnoResults(FROM: any, TO: any, GTYPE: any): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/GetCaisnoResults?from=${FROM}&to=${TO}&gtype=${GTYPE}`);
  }
  UserDescription():Observable<any> {
    return this.http.get(`${this.BASEURL}/Data/UserDescription`)
  }
  Fund():Observable<any> {
    return this.http.get(`${this.BASEURL}/Data/Fund`)
  }

  GetCurrentBets(): Observable<any> {
    return this.http.get(`${this.BASEURL}/Reports/GetCurrentBets`);
  }

  GetDepositInfo():Observable<any>{
  return this.http.get(`http://www.kingsbid.in/Read3/BetBuzzClient.svc/Reports/GetDepositInfo`);
  }

  SaveDepositWithdrawalReq(data:any):Observable<any>{
  return this.http.post(`http://www.kingsbid.in/Read3/BetBuzzClient.svc/Reports/SaveDepositWithdrawalReq`,data);
  }

  GetPaymentHistory():Observable<any>{
  return this.http.get(`http://www.kingsbid.in/Read3/BetBuzzClient.svc/Reports/GetPaymentHistory`);
}

}
