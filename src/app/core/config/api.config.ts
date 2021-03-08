import { Injectable } from "@angular/core";
import { Constants } from "../constants/constants";

/**
 * @description Interface to provide fixed structure
 */
export interface IApiEndpoint {
  name: string;
  method?: string;
  url: string;
  restfull?: boolean;
  server?: string;
}

/**
 *  @description Http methods enum
 */
export enum ApiEndpointType {
  GET,
  PUT,
  POST,
  DELETE
}

@Injectable({
  providedIn: "root"
})
export class EndpointService {
  private readonly baseUrl: string = Constants.baseUrl;
  private endpoints: Array<IApiEndpoint> = [];

  constructor() {
    this.init();
  }

  /**
   * @param name name
   * @description returns end point for given api name
   */
  get(name: string): IApiEndpoint {

    const requiredEndpoint = this.endpoints.find(
      endpoint => endpoint.name === name
    );

    if (requiredEndpoint && requiredEndpoint.url.indexOf(this.baseUrl) !== 0) {
      // check if endpoint url has the baseUrl already.
      requiredEndpoint.url = this.baseUrl + requiredEndpoint.url;
    }

    if (requiredEndpoint) {
      return requiredEndpoint;
    } else {
      const nunEndPoint: IApiEndpoint = { name: "", url: "", method: "", server: "" };
      return nunEndPoint;
    }
  }

  /**
   * @description Initialize endpoints array
   */
  private init(): void {
    this.endpoints = [

      /**
       * USER APIS
       */
      { name: "LOGIN", url: "user/login", method: "POST", server: "auth" },
      { name: "LOGOUT", url: "users/logout", method: "DELETE", server: "auth" },
      { name: "FORGOT_PASSWORD", url: "users/forgot-password", method: "POST", server: "auth" },
      { name: "RESET_PASSWORD", url: "users/reset-password", method: "POST", server: "auth" },
      { name: "CHANGE_PASSWORD", url: "users/change-password", method: "POST" },
      { name: "TOKEN_VALIDATE", url: "users/check-reset-token", method: "GET", server: "auth" },
      { name: "GET_LOGGEDINUSER", url: "users", method: "GET", server: "auth" },
      { name: "UPDATE_PROFILE", url: "users/update", method: "POST", server: "auth" },
      { name: "GET_ALL_USER_TYPE", url: "user-type/get-all-user-type", method: "GET", server: "auth" },

      /**
       * S3 BUCKET APIS
       */
      { name: "GET_S3_PRE_SIGNED_URL", url: "s3/pre-signed-url", method: "POST", server: "auth" },
      { name: "GET_S3_CREDENTIAL", url: "s3/get-credential", method: "GET" },

      /**
       * COMPANY APIS
       */
      { name: "GET_ALL_COMPANY", url: "company/get-all-company", method: "POST" },
      { name: "GET_COMPANY_BY_ID", url: "company/get-company-by-id", method: "POST" },

      //  for path params example
      // 
      // const param: ApiParam = {
      //   data: {
      //     companyId: vendorId
      //   },
      //   pathParams: {
      //     companyId: vendorId,
      //     salary:4000
      //   }
      // };
      // { name: "GET_COMPANY_BY_ID", url: "company/get-company-by-id/companyId", method: "POST" },
      // { name: "GET_COMPANY_BY_ID", url: "company/get-company-by-id/companyId/salary", method: "POST" },

      /**
       * SUBSCRIBER APIS
       */
      { name: "GET_ALL_SUBSCRIBER", url: "subscriber/get-all-subscriber", method: "POST" },
      { name: "GET_SUBSCRIBER_BY_ID", url: "subscriber/get-subscriber-by-id", method: "POST" },
      { name: "DEACTIVATE_SUBSCRIBER", url: "subscriber/deactivate-subscriber", method: "POST" },
      { name: "UPDATE_SUBSCRIBER", url: "subscriber/update-subscriber", method: "PUT" },
      { name: "RESET_SUBSCRIBER_PASSWORD", url: "subscriber/reset-password", method: "POST" },
      { name: "SUBSCRIBER_EXPORT_TO_EXCEL", url: "subscriber/export-to-excel", method: "POST" },
      { name: "SUBSCRIBER_EXPORT_TO_PDF", url: "subscriber/export-to-pdf", method: "POST" },

      // @@@@@@@@@@@@@@@@@@@@@@ NEW UPDATED API @@@@@@@@@@@@@@@@@@@@@@

    ];
  }

}
