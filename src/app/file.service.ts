import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user';
import { AppSettings } from './app.setting';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class FileService {

  constructor(private http: Http) { }

  /*
   * getAllFiles(user): Service to get all files of user
   */
  getAllFiles(user: String){
    return this.http.get(AppSettings.API_URL + '/upload/' +user)
               .map(this.extractData)
               .catch(this.errorHandler);
  }

  /*
   * deleteFile(user): Service to delete file
   */
  deleteFile(id: String){
    return this.http.delete(AppSettings.API_URL + '/upload/' +id)
               .map(this.extractData)
               .catch(this.errorHandler);
  }

  /*
   * downloadFile(user, id): Service to download file
   */
  downloadFile(user:String, id: String){
    return this.http.get(AppSettings.API_URL + '/upload/' + user + '/' +id,
                        {responseType: ResponseContentType.Blob});
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
