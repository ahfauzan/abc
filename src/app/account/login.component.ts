import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import * as Parse from 'parse';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FunctionExpr } from '@angular/compiler';

@Component({ templateUrl: 'login.component.html' })
@Injectable()
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    public user1: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
       // private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY);
        Parse.serverURL = environment.serverURL;
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }
    public get userValue(): User {
        console.log("this.userSubject.value");
        return this.userSubject.getValue();
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
 const user1 = new User();
        this.loading = true;
//        try {
//             const user = await Parse.User.logIn(this.f.username.value, this.f.password.value);
//             console.log(user);
// user1.id=user.id;
//             user1.sessionToken=user.get("sessionToken");
//             user1.firstName=user.get("firstName");
//             user1.lastName=user.get("lastName");
//             user1.username=user.get("username");
//             user1.password=user.get("password");

//             console.log(user1.sessionToken);
//             localStorage.setItem('user', JSON.stringify(user1));
//             this.userSubject.next(user1);
//             console.log([this.returnUrl]);
//             console.log(this.userSubject.getValue());
//             this.router.navigate([this.returnUrl]) ;
            
//             return user1; 
//         } catch (error) {
//             this.alertService.error(error);
//             this.loading = false;
//         }
        
    //  const data= await this.accountService.login(this.f.username.value, this.f.password.value);
    //  console.log(data);
    //        if(data)
    //        this.router.navigate([this.returnUrl]);
    //        else()
    //        {   this.alertService.error(data);
    //         this.loading = false;}
        

    // if(this.accountService.login(this.f.username.value, this.f.password.value).sessionToken) 
    // this.router.navigate([this.returnUrl]);
    // else
    //  // this.alertService.error();
    //  this.loading = false;

      // }
      const data=await this.accountService.login(this.f.username.value, this.f.password.value)
            .then()
            if(data) {
                    this.router.navigate([this.returnUrl]);
                }
               else(data) => {
                    this.alertService.error(data);
                    this.loading = false;
                };
    }
    
           }
        //}