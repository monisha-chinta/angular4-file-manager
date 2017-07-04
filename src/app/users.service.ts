import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user';
import { AppSettings } from './app.setting';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private uploadHeaders = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

  constructor(private http: Http) { }

  /*
   * login(user): Service to authenticate user
   */
  login(user: User): Observable<User> {
    return this.http.post(AppSettings.API_URL + '/login', JSON.stringify(user), {headers: this.headers})
               .map(this.extractData)
               .catch(this.errorHandler);
  }

  /*
   * register(user): Service to register user
   */
  register(user: User): Observable<User>{
    return this.http.post(AppSettings.API_URL + '/register', JSON.stringify(user), {headers: this.headers})
               .map(this.extractData)
               .catch(this.errorHandler);
  }

  /*
   * logout(): Service to logout user
   */
  getUserName(user: string) {
    return this.http.get(AppSettings.API_URL + '/users/' +user)
                .map(this.extractData)
                .catch(this.errorHandler);
  }


  /*
   * logout(): Service to logout user
   */
  logout() {
    return this.http.get(AppSettings.API_URL + '/logout');
  }

  /*
   * extractData(response): helper function to handle response in map method
   */
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  /*
   * errorHandler(error): helper function to handle errors
   */
  private errorHandler(error: any) {
    return Observable.throw(error.statusText || error);
  }

}
