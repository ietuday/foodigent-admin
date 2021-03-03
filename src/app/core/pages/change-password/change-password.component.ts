import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';
import { UserModel } from '../../models/user.model';
import { ApiParam, ApiResponse, ApiService } from '../../services/api/api.service';
import { AuthService } from '../../services/authentication/auth/auth.service';
import { LoadingService } from '../../services/loading/loading.service';
import { ToastService } from '../../services/toast/toast.service';
import { matchingPasswords } from '../../utils/custom.validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup = new FormGroup({});
  user: UserModel = {};
  currentPasswordHide = true;
  newPasswordHide = true;
  confirmNewPasswordHide = true;

  constructor(
    private titleService: Title,
    public router: Router,
    public fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("iGrab Admin | Change Password");

    let passwordPattern = "^(?=[^a-zA-Z]*[a-zA-Z])(?=[^0-9]*[0-9]).{8,}$";
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.pattern(passwordPattern)]],
      password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
      confirmPassword: ['', [Validators.required]]
    },
      {
        validator: matchingPasswords('password', 'confirmPassword')
      });

    // if (this.authService.isLoggedIn()) {
    //   this.authService.loggedInUser().subscribe((result) => {
    //     this.user = result.data as UserModel;
    //   });
    // } else {
    //   this.router.navigate(['/']);
    // }
  }

  /**
   * @description submiting credentials to server and authenticate
   */
  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const param: ApiParam = {
        data: {
          email: this.user.email || 'ashutoshsgole@gmail.com',
          oldPassword: this.changePasswordForm.value.oldPassword,
          newPassword: this.changePasswordForm.value.confirmPassword
        }
      };

      this.loadingService.show();
      this.apiService.request('CHANGE_PASSWORD', param).subscribe((response: ApiResponse) => {
        this.changePasswordForm.reset();
        this.loadingService.hide();
        if (response.isSuccess) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true,
            // hasBackdrop: true,
            height: "280px",
            width: "480px",
            data: {
              header: 'Change Password',
              message: 'Password has been changed. Please log in with your new password',
              // firstButtonText: 'Cancel',
              secondButtonText: 'Login'
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === "yes") {
              this.authService.logout().subscribe((res) => {
                this.router.navigate(['/']);
              });
            }
          });
        }
      },
        error => {
          this.loadingService.hide();
        });
    } else {
      (this.changePasswordForm.get('oldPassword') as AbstractControl).markAsTouched();
      (this.changePasswordForm.get('confirmPassword') as AbstractControl).markAsTouched();
      (this.changePasswordForm.get('password') as AbstractControl).markAsTouched();
    }
  }

  /**
   * @description get back to previous page
   */
  cancel() {
    this.router.navigate(['./dashboard']);
  }

}
