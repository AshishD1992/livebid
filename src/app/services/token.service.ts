import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class TokenService {
  setLoggedIn: any;

  constructor(private cookieService: CookieService, private router:Router) {}

  setToken(token: string){
    this.cookieService.set('AuthToken', token);
  }
  getToken(){
    return this.cookieService.get('AuthToken');
  }
  removeToken(){
    this.cookieService.delete('AuthToken');
  }
}
