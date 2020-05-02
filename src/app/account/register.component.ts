import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '@environments/environment';
import * as Parse from 'parse';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {
        Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY);
        Parse.serverURL = environment.serverURL;
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
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
        const user = new Parse.User();
        user.set('firstName', this.form.value.firstName);
        user.set('lastName', this.form.value.lastName);
        user.set('username', this.form.value.username);
        user.set('password', this.form.value.password);
        // var data = {
        //     'firstName': this.form.value.firstName,
        //     'lastName': this.form.value.lastName,
        //     'username': this.form.value.username,
        //     'password': this.form.value.password
        // };
        // //user.set("rememberMe", this.rememberMe);
        // //return this.http.post(`${environment.serverURL}/users/register`, user);
        try {
            await user.signUp();
            this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            this.router.navigate(['../login'], { relativeTo: this.route });

        } catch (error) {
            this.alertService.error(error);
            this.loading = false;
        }
        // const res = user.signUp();
        // if (user.signUp()) {

        // }
        // user.signUp().then(
        //     function () {
        //         this.alertService.success('Registration successful', { keepAfterRouteChange: true });
        //         this.router.navigate(['../login'], { relativeTo: this.route });
        //     },

        //     function (error) {
        //         this.alertService.error(error);
        //         this.loading = false;
        //     }
        // );
        // this.accountService.register(this.form.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.alertService.success('Registration successful', { keepAfterRouteChange: true });
        //             this.router.navigate(['../login'], { relativeTo: this.route });
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
        // // console.log(this.form.value);
        // console.log(user);
    }
}