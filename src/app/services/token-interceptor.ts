import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    isLoggedInSet: boolean = false;
    constructor(
        private tokenService: TokenService,
        private router: Router,
        private auth: AuthService
    ) {

    }

intercept(
req: HttpRequest<any>,
next: HttpHandler
): Observable<HttpEvent<any>> {
const headersConfig = {
Token: '',
};
const authToken = this.tokenService.getToken();
if (authToken) {
headersConfig['Token'] = authToken;
}
const _req = req.clone({ setHeaders: headersConfig });
return next.handle(_req).pipe(
catchError((error: any, caught: Observable<any>) => {
if (error.status === 401) {
this.router.navigate(['/login']);
this.tokenService.removeToken();
 this.auth.setLoggedIn(false);
}
return throwError(error);
})
);
}
}