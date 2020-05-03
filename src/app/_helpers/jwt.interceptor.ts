import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';
import {LoginComponent}  from '@app/account/login.component';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService,
        private loginComponent: LoginComponent) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
       // const user = this.accountService.userValue;
        const user = this.loginComponent.userValue;
        const isLoggedIn = user && user.sessionToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.sessionToken}`
                }
            });
        }

        return next.handle(request);
    }
}