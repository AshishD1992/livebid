import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HubAddress } from '../models/hub-address.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  BASE_URL = `${environment.readUrl}/Data`;

  constructor(private http: HttpClient) {}

  getAllMarketData(marketId: number) {
    return this.http.get(`${this.BASE_URL}/AllMarketData?mtid=${marketId}`);
  }

  getHubAddress(marketId: number) {
    return this.http.get<HubAddress>(`${this.BASE_URL}/HubAddress?id=${marketId}`);
  }

  getBFCricScore(eventIds):Observable<any>{
    return this.http.get(`https://ips.betfair.com/inplayservice/v1/scores?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=en_GB&eventIds=${eventIds}`);
  }

  getBFSTScore(eventIds):Observable<any>{
    return this.http.get(`https://ips.betfair.com/inplayservice/v1/eventTimelines?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=de&eventIds=${eventIds}`);
  }
  GetScoreId(eventIds):Observable<any>{
    return this.http.get(`http://173.249.21.26/SkyImporter/MatchImporter.svc/GetScoreId?eventid=${eventIds}`);
  }

}
