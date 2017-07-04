import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

import { User } from '../user';
import { UsersService } from '../users.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    local: {
      name: '',
      email: '',
      password: ''
    },
    _id: ''
  };

  errorMsg: boolean;
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);

  constructor(private usersService: UsersService, private router:Router) { }

  ngOnInit() {
  }

  /*
   * login: login function
   * success => navigate to user home page
   */
  login() {
    this.usersService.login(this.user).subscribe(
      (data) => {
        this.router.navigate(['/home', data._id]);
      },
      (error) => {
        this.errorMsg = true;
      }
    );
  }
}

//,{ queryParams: { username: data.local.name }}
