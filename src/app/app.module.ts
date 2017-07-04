import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdToolbarModule, MdInputModule,
         MdGridListModule, MdMenuModule, MdTooltipModule,
         MdDialogModule} from '@angular/material';
import { EmailValidator } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FileSelectDirective } from 'ng2-file-upload';

import { AppRoutingModule } from './app.routing.module';
import { UsersService } from './users.service';
import { FileService } from './file.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdToolbarModule,
    MdInputModule,
    MdGridListModule,
    MdMenuModule,
    MdTooltipModule,
    CommonModule,
    MdDialogModule
  ],
  providers: [
    UsersService,
    FileService,
    EmailValidator
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
