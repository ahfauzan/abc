import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/_services';
import {LoginComponent}  from '@app/account/login.component';
import { AccountModule } from '@app/account/account.module';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
       private router: Router,
        private accountService: AccountService,
     //  private loginComponent: LoginComponent
    ) {}
   // private loginComponent: LoginComponent;
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //const user=true;
       //console.log(this.loginComponent);
        const user = this.accountService.userValue;
        if (user) {
            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}