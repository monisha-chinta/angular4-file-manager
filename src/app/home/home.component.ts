import { Component, OnInit, ElementRef, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Http, Response } from '@angular/http';
import { UsersService } from '../users.service';
import { FileService } from '../file.service';
import { AppSettings } from '../app.setting';
import 'rxjs/Rx' ;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: string;
  username: string;
  uploader:FileUploader;
  files: Array<{}>;
  download_url: string;
  fileStatus: {
    status: boolean,
    message: string
  };

  constructor(private usersService: UsersService,
              private fileService: FileService,
              private router: Router,
              private el: ElementRef,
              private route: ActivatedRoute) {
    this.user = route.snapshot.params['user'];

    this.uploader = new FileUploader({
                    url: AppSettings.API_URL + '/upload/' + this.user});
  }

  ngOnInit() {
    this.getUserName();
    this.getAllUserFiles();
    this.uploader.onAfterAddingFile = (file: any) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      var responseMessage = JSON.parse(response);
        this.fileStatus = {
          status: status == 200,
          message: responseMessage.message
        }
        this.getAllUserFiles();
    };
  }

  /*
   * getAllUserFiles: get all files uploaded of particular user
   */
  getAllUserFiles() {
    this.fileService.getAllFiles(this.user).subscribe(
      (data) => {
        this.files = data.files;
      },
      (error) => {
        this.router.navigate(['/home', this.user]);
      }
    );
  }

  getUserName() {
    this.usersService.getUserName(this.user).subscribe(
      (data) => {
        this.username = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /*
   * delete: function to delete file based on file id
   */
  delete(fileId) {
    this.fileService.deleteFile(fileId).subscribe(
      (data) => {
        this.getAllUserFiles();
      },
      (error) => {
        alert(error);
      }
    );
  }

  /*
   * download: function to download file based on file id and user id
   */
  download(fileId) {
    this.fileService.downloadFile(this.user, fileId).subscribe(
      (data) => {
        var type, name;

        data.headers["_headers"].forEach((value, key, map) => {
          if(key == 'content-type') {
            type = value
          } else if(key == 'file-name') {
            name = value;
          }
        })
        if(type && name) {
          this.downloadFile(data, type, name);
        }
      },
      (error) => {
        alert(error);
      }
    );
  }

  /*
   * downloadFile: helper function to download file using file-saver plugin
   */
  downloadFile(res: any, type:string, name: string){
    var file = new File([res._body], name, {type: type});
    saveAs(file);
  }

  /*
   * logout: function to let user logout
   */
  logout() {
    this.usersService.logout().subscribe(
      (data) =>  this.router.navigate(['/login']),
      (error) => console.log(error)
    );
  }
}
