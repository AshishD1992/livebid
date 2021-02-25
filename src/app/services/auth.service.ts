import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

export const AUTH_TOKEN = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASEURL = environment.readUrl;
  private _isLoggedInSub = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedInSub.asObservable();

  constructor(private http: HttpClient, private cookie: CookieService) {
    if (this.isLoggedIn()) {
      this.setLoggedIn(true);
    }
   }

  
   login(data: any): Observable<any> {
    return this.http.post(`${this.BASEURL}/Login`, data);
  }
  changePwd(data: any): Observable<any> {
    return this.http.post(`${this.BASEURL}/ChangePwd`, data);
  }
  logout(data: any): Observable<any> {
    return this.http.post(`${this.BASEURL}/Logout`, data);
  }



  isLoggedIn() {
    let authToken = this.cookie.get(AUTH_TOKEN);
    return this.cookie.get(AUTH_TOKEN) && authToken !== '';
  }
  setLoggedIn(isLoggedIn: boolean) {
    if (this._isLoggedInSub.getValue() !== isLoggedIn) {
      this._isLoggedInSub.next(isLoggedIn);
    }
  }
}
