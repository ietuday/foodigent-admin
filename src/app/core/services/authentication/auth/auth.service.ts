import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppStorageService } from '../app-storage/app-storage.service';
import { LoadingService } from '../../loading/loading.service';
import { EndpointService } from '../../../config/api.config';
import { ExceptionService } from '../../exception/exception.service';
import { ApiResponse, ApiService } from '../../api/api.service';

export interface ILoginRequest {
  email: string;
  password: string;
  ipAddress?: string;
}

export interface IResponse {
  success: boolean;
  result: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LoggedInUserSubject = new Subject<any>();
  private loggedInUserState: any;
  currentUser: any;

  constructor(
    @Optional() @SkipSelf() prior: AuthService,
    private http: HttpClient,
    private router: Router,
    private endpointService: EndpointService,
    private exceptionService: ExceptionService,
    private appStorageService: AppStorageService,
    private loadingService: LoadingService
  ) { }

  /**
   * @description check user is logged in or not
   */
  isLoggedIn(): boolean {
    return this.appStorageService.get('auth_token') != null;
  }

  /**
   * @description tries to login user with the given request.
   * @param request request
   */
  login(request: ILoginRequest): Observable<any> {
    this.loadingService.show();
    let url;
    try {
      url = this.endpointService.get('LOGIN').url;
    } catch (error) {
      catchError(this.exceptionService.catchBadResponse);
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    request['ipAddress'] = "192.218.43.11";
    const body = JSON.stringify(request);

    const response = this.http.post(`${url}`, body, { headers }).pipe(map((res) => {
      const resp = this.extractData(res);

      this.saveTokenOnSuccessLogin(resp);
      this.loadingService.hide();
      return resp;
    }))
      .pipe(catchError(this.exceptionService.catchBadResponse));

    return response;
  }

  /**
   * @description logs out user and deactivate the token on the server.
   */
  logout(): Observable<any> {
    this.loadingService.show();
    const url = this.endpointService.get('LOGOUT').url;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.appStorageService.get('auth_token')
    });
    const response = this.http
      .delete(`${url}`, { headers })
      // .map(res => <IResponse>res.json().data)
      .pipe(map(res => res as ApiResponse))
      .pipe(catchError(this.exceptionService.catchBadResponse))
      .pipe(finalize(() => this.clearTokenOnSuccessLogout()));
    return response;
  }

  /**
   * @description get logged in user data
   * @param update update
   */
  loggedInUser(update?: boolean): Observable<any> {

    if (this.currentUser && !update) {
      return of(this.currentUser);
    }

    if (!this.currentUser || update) {
      this.loggedInUserState = this.LoggedInUserSubject.asObservable();
      const url = this.endpointService.get('GET_LOGGEDINUSER').url;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.appStorageService.get('auth_token')
      });

      const response = this.http
        .get(`${url}`, { headers })
        .pipe(map((res: any) => res['data']['userDetails']))
        .pipe(catchError(this.exceptionService.catchBadResponse));

      response.subscribe(resp => {
        this.currentUser = resp;
        // if(resp.data){
        //     this.appStorage.save('userType', resp.data['type']);
        // }
        this.LoggedInUserSubject.next(resp);
      });
    }

    return this.loggedInUserState;
  }

  /**
   * @description save token when login success
   * @param response response
   */
  public saveTokenOnSuccessLogin(response: any): void {
    if (response) {
      // tslint:disable-next-line:no-string-literal
      // const token = response['data'].tokenDetails['accessToken'];
      // const refreshToken = response['data'].tokenDetails['refreshToken'];
      // this.LoggedInUserSubject.next(response['data']['userDetails']);
      // this.appStorageService.save('auth_token', token);
      // this.appStorageService.save('refresh_token', refreshToken);

      const token = response['data'].token;
      // const refreshToken = response['data'].tokenDetails['refreshToken'];
      this.LoggedInUserSubject.next(response['data']);
      this.appStorageService.save('auth_token', token);
      // this.appStorageService.save('refresh_token', refreshToken);
    }
  }

  /**
   * @description clear token when logout
   */
  private clearTokenOnSuccessLogout(): void {
    this.loadingService.hide();
    this.router.navigate(['auth']);
    this.appStorageService.clear();
    this.currentUser = null;
    this.loggedInUserState = null;
  }

  /**
   * @description extract data
   * @param res res
   */
  private extractData(res: any): any {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new Error('Bad response statusCode: ' + res.statusCode);
    }
    const body = res ? res : null;
    return body || {};
  }

  /**
   * @description set new user
   * @param user user
   */
  public setNewUser(user: any): void {
    this.currentUser = user;
    this.LoggedInUserSubject.next(user);
  }

}
