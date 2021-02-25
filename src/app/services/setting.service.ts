import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SettingService {
  BASEURL=environment.betUrl

  constructor(private http: HttpClient) { }


  GetBetStakeSetting(): Observable<any> {
    return this.http.get(`${this.BASEURL}/Settings/GetBetStakeSetting`);
  }
  
  SaveBetStakeSetting(data: any): Observable<any> {
    return this.http.post(`${this.BASEURL}/Settings/SaveBetStakeSetting`, data);
  }
}
