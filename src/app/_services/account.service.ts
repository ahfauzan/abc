import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Parse from 'parse';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { UserA } from '@app/_models/usera';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    public usera: Observable<UserA>;
//    usera:UserA;


    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        Parse.initialize(environment.PARSE_APP_ID, environment.PARSE_JS_KEY);
        Parse.serverURL = environment.serverURL;
    }

    public get userValue(): User {
        return this.userSubject.value;
    }
    // const user1=new User();
   async login(username, password) {  
        const data=new User(); 
  const user=await Parse.User.logIn(username,password);
    console.log(user);
data.id=user.id;
    data.sessionToken=user.get("sessionToken");
    data.firstName=user.get("firstName");
    data.lastName=user.get("lastName");
    data.username=user.get("username");
    data.password=user.get("password");

    console.log(data.sessionToken);
    localStorage.setItem('user', JSON.stringify(data));
    this.userSubject.next(data);
  //  console.log([this.returnUrl]);
    console.log(this.userSubject.getValue());
  //  this.router.navigate([this.returnUrl]) ;
    
    return data; 
   }
      
    // async login(username, password) {
    //      return await Parse.User.logIn(username, password)
    //         .pipe(map((user) => {
                
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('user', JSON.stringify(user));
    //             console.log(user);
    //             //this.userSubject.next(user);
    //             return user;
    //         }));
    
    //     // .pipe(map(user => {
    //     //     // store user details and jwt token in local storage to keep user logged in between page refreshes

    //     // }));
    //     //     localStorage.setItem('user', JSON.stringify(user));
    //     //     this.userSubject.next(user);
    //     //     this.router.navigate([this.returnUrl]);


    //     return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
    //         .pipe(map(user => {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('user', JSON.stringify(user));
    //             this.userSubject.next(user);
    //             return user;
    //         }));
    // }
 
    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}