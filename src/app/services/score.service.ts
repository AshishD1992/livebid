import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http:HttpClient) { }

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
