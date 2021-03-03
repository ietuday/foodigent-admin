import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppStorageService } from 'src/app/core/services/authentication/app-storage/app-storage.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { fadeInAnimation } from '../../../core/utils/app-annimations';
import { ApiResponse } from 'src/app/core/services/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInAnimation]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  passwordType = 'password';
  passwordHide = true;
  wrongPassword = false;
  userRemoved = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appStorageService: AppStorageService,
    private titleService: Title
    // private onlineService: OnlineService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("iGrab Admin | Login");

    const rememberedEmail = localStorage.getItem('email');
    this.loginForm = this.fb.group({
      email: [rememberedEmail, [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: [null, Validators.required],
      rememberMe: [rememberedEmail ? true : false]
    });
  }

  /**
   * @description for login
   */
  login(): void {
    if (this.loginForm.valid) {
      const data = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
        // userRole: Constants.userRole
      };

      this.authService.login(data).subscribe((result: ApiResponse) => {
        // this.onlineService.setOnline();
        if (this.loginForm.value.rememberMe) {
          this.appStorageService.saveExtraItem('email', this.loginForm.value.email);
        } else {
          localStorage.removeItem('email');
        }

        if (result.isSuccess) {
          this.router.navigate(['/']);
        } else if (!result.isSuccess && result.message == "User Deleted") {
          this.userRemoved = true;
        }
        else {
          this.wrongPassword = true;
        }
      });
    } else {
      (this.loginForm.get('email') as AbstractControl).markAsTouched();
      (this.loginForm.get('password') as AbstractControl).markAsTouched();
    }
  }

}
