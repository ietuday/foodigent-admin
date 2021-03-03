import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AppStorageService } from '../authentication/app-storage/app-storage.service';
import { LoadingService } from '../loading/loading.service';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {
  errorMessage = [
    'This link is expired',
    'Token is expired'
  ];

  constructor(
    private router: Router,
    private toastService: ToastService,
    private appStorageService: AppStorageService,
    private loadingService: LoadingService
  ) { }

  /**
   * @description logs the error to the console.
   * @param error error
   */
  log(error: string): void {
    console.log(error);
  }

  /**
   * @description catch bad response
   * @param errorResponse error
   */
  catchBadResponse: (errorResponse: any) => Observable<any> = (errorResponse: any) => {
    this.loadingService.hideAll();
    this.handleStatusCode(errorResponse.status);
    const err: string = errorResponse.error['details']?.length > 0 ? errorResponse.error['details'] : null;
    this.log(errorResponse);
    if (err && this.errorMessage.findIndex(msg => msg === err) < 0) {
      this.toastService.activateError(err[0]);
    } else {
      const serverError: string = errorResponse.error['message']
        ?
        errorResponse.error['message']
        :
        errorResponse.status === 0
          ?
          'No Internet connection'
          :
          errorResponse.message;
      this.toastService.activateError(serverError);
    }
    return throwError(errorResponse);
  }

  /**
   * @description handle status code
   * @param statusCode statusCode
   */
  private handleStatusCode(statusCode: number): void {
    switch (statusCode) {
      case 401:
        this.appStorageService.clear();
        this.router.navigate(["auth"]);
        break;
      case 0:
        // this.appStorage.clear();
        // this.router.navigate(["/"]);
        break;
    }
  }

}
