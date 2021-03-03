import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../services/authentication/auth/auth.service';
import { matchingPasswords } from '../../utils/custom.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup = new FormGroup({});
  email: any;
  token: any;
  passwordHide = true;
  confirmPaasswordHide = true;

  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("iGrab Admin | Reset Password");

    this.activatedRoute.paramMap.subscribe(params => {
      console.log("params===============", params);
      this.email = params.get('email');
      this.token = params.get('token');
      this.checkUser();

      let passwordPattern = "^(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).{8,}$";
      this.resetForm = this.fb.group({
        password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
        confirmPassword: ['', [Validators.required]]
      },
        {
          validator: matchingPasswords('password', 'confirmPassword')
        });

      if (this.token === "null") {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: true,
          // hasBackdrop: true,
          height: "280px",
          width: "480px",
          data: {
            header: 'Reset Password',
            message: 'Reset password link is expired, Please go to login page',
            // firstButtonText: 'Cancel',
            secondButtonText: 'Login'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === "yes") {
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  /**
   * @description check user
   */
  checkUser() {
    if (this.authService.isLoggedIn()) {
      this.authService.loggedInUser().subscribe(res => {
        if (res['data'].email !== this.email) {
          // this.authService.logout().subscribe(res =>{
          //   this.toastService.activate('Invalid user credentials, Please try again');
          //   // window.history.back();
          // })
          this.toastService.activateError('You need to logout from this account to process your request.')
          this.router.navigate(['/']);
        }
      })
    }
  }

  /**
   * @description for resetPassword
   */
  resetPassword(): void {
    if (this.resetForm.valid) {
      const param: ApiParam = {
        data: {
          email: this.email,
          password: this.resetForm.value.password,
          confirmPassword: this.resetForm.value.confirmPassword,
        }
      };

      this.loadingService.show();
      this.apiService.request('RESET_PASSWORD', param).subscribe((response: ApiResponse) => {
        this.resetForm.reset();
        this.loadingService.hide();
        if (response.isSuccess) {
          this.toastService.activateSuccess(response.message);
          this.router.navigate(['/']);
        }
      },
        error => {
          this.loadingService.hide();
        });
    } else {
      (this.resetForm.get('password') as AbstractControl).markAsTouched();
      (this.resetForm.get('confirmPassword') as AbstractControl).markAsTouched();
    }
  }

}
