import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import * as Parse from 'parse';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY);
        Parse.serverURL = environment.serverURL;
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }
    public get userValue(): User {
        return this.userSubject.value;
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

        this.loading = true;
        try {
            const user = await Parse.User.logIn(this.f.username.value, this.f.password.value);
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            this.router.navigate([this.returnUrl]);

        } catch (error) {
            this.alertService.error(error);
            this.loading = false;
        }
        // this.accountService.login(this.f.username.value, this.f.password.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }
}