import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ExceptionService } from '../exception/exception.service';
import { AppStorageService } from '../authentication/app-storage/app-storage.service';
import { LoadingService } from './../loading/loading.service';
import { EndpointService, IApiEndpoint, ApiEndpointType } from './../../config';
import { Observable } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

export interface ApiParam {
  data?: any;
  queryParams?: any;
  pathParams?: any;
}

export interface Paginator {
  currentPage: number;
  limit: number;
  nextPage: string;
  previousPage: number;
  totalCount: number;
  totaPages: number;
}

export interface ApiResponse {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private exceptionService: ExceptionService,
    private appStorageService: AppStorageService,
    private endpointService: EndpointService,
    private loadingService: LoadingService
  ) { }

  /**
   * @description for api calling
   * @param name 
   * @param params 
   */
  request(name: string, params?: ApiParam): Observable<any> {
    const endpoint: IApiEndpoint = this.getEndpoint(name);
    let url;
    if (params && params.pathParams) {
      url = this.addPathParamsIfAny(endpoint.url, params);
    } else if (params && params.queryParams) {
      url = this.addQueryParamsIfAny(endpoint.url, params);
    } else {
      url = endpoint.url;
    }

    const method = (endpoint.method) ? endpoint.method : "GET";
    const requestOptions = {
      headers: this.getHeaders(),
      body: params ? params.data : {},
      // search: this.getQueryParams(params)
    };

    // this.loadingService.show();
    return (
      this.http
        .request(method, url, requestOptions)
        .pipe(map(res => this.extractData<ApiResponse>(res)))
        .pipe(catchError(this.exceptionService.catchBadResponse))
      // .pipe(finalize(() => this.loadingService.hide()))
    );
  }

  /**
   * @description add path params
   * @param url 
   * @param data 
   */
  private addPathParamsIfAny(url: string, data: ApiParam): string {
    if (data && data.pathParams) {
      for (const key in data.pathParams) {
        if (data.pathParams.hasOwnProperty(key)) {
          const value = data && data.pathParams[key];
          url = url.replace(key, value);
        }
      }
    }
    return url;
  }

  /**
   * @description get query params
   * @param params 
   */
  private getQueryParams(params: ApiParam): HttpParams {
    const queryParam = new HttpParams();

    if (params && params.queryParams) {
      for (const key in params.queryParams) {
        if (params.queryParams.hasOwnProperty(key)) {
          const value = params.queryParams[key];
          queryParam.append(key, value);
        }
      }
    }
    return queryParam;
  }

  /**
   * @description get end point data
   * @param name 
   */
  private getEndpoint(name: string): IApiEndpoint | any {
    const endpoint = this.endpointService.get(name);

    if (!endpoint) {
      throw new Error('No endpoint is registered with' + name);
    }
    return endpoint;
  }

  /**
   * @description get headers
   */
  private getHeaders(): HttpHeaders {
    const token = this.appStorageService.get('auth_token');
    let requestHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token && !requestHeaders.has('Authorization')) {
      requestHeaders = requestHeaders.append('Authorization', 'Bearer ' + token);
    }
    return requestHeaders;
  }

  /**
   * @description extract data
   * @param res 
   */
  private extractData<R>(res: any): R {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    const body = res ? res : null;
    return (body || {}) as R;
  }

  /**
   * @description aa path params
   * @param url 
   * @param data 
   */
  private addQueryParamsIfAny(url: string, data: ApiParam): string {
    if (data && data.queryParams) {
      url = url.concat('?');
      const parmasArray = [];
      for (const key in data.queryParams) {
        if (data.queryParams.hasOwnProperty(key)) {
          const value = data.queryParams[key];
          parmasArray.push(key + '=' + value);
        }
      }
      url = url.concat(parmasArray.join('&'));
    }
    return url;
  }

  /**
   * @description get presigned link
   * @param link 
   */
  public getPreSignedLink(link: string) {
    const param: ApiParam = {
      data: {
        'url': link
      }
    };

    this.loadingService.hide();
    this.request("GET_S3_PRE_SIGNED_URL", param).subscribe((response: ApiResponse) => {
      this.loadingService.hide();
      window.open(response.data.url, '_blank');
    },
      error => {
        this.loadingService.hide();
      });
  }

}
