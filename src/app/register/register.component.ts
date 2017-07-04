import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';


import { User } from '../user';
import { UsersService } from '../users.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit() {
  }

  /*
   * register: function to register new user
   * success => navigate to user home page
   */
  register() {
    this.usersService.register(this.user).subscribe(
      (data) => {
        this.router.navigate(['/home', data._id], { queryParams: { username: data.local.name } });
      },
      (error) => {
        this.errorMsg = true;
      }
    );
  }
}
