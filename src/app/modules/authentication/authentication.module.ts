import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared.module';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthHomeComponent } from './auth-home/auth-home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from 'src/app/core/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/core/pages/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AuthHomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule { }
