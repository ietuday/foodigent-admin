import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup = new FormGroup({});

  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("iGrab Admin | Forgot Password");

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]]
    });
  }

  /**
   * @description for sendForgotPasswordLink
   */
  sendForgotPasswordLink(): void {
    if (this.forgotForm.valid) {

      const param: ApiParam = {
        data: {
          email: this.forgotForm.value.email
        }
      };

      this.loadingService.show();
      this.apiService.request('FORGOT_PASSWORD', param).subscribe((response: ApiResponse) => {
        this.toastService.activateSuccess(response.message);
        this.forgotForm.reset();
        this.loadingService.hide();
      },
        error => {
          this.loadingService.hide();
        });
    } else {
      (this.forgotForm.get('email') as AbstractControl).markAsTouched();
    }
  }

}
