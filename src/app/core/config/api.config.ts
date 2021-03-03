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
       * MERCHANDISE APIS
       */
      { name: "DEACTIVATE_MERCHANDISE", url: "merchandise/deactivate-merchandise", method: "POST" },
      { name: "ADD_MERCHANDISE", url: "merchandise/add-merchandise", method: "POST" },
      { name: "UPDATE_MERCHANDISE", url: "merchandise/update-merchandise", method: "PUT" },
      { name: "MERCHANDISE_EXPORT_TO_EXCEL", url: "merchandise/export-to-excel", method: "POST" },
      { name: "MERCHANDISE_EXPORT_TO_INVOICE", url: "merchandise/export-to-invoice", method: "POST" },


      { name: "VENDORS_EXPORT_TO_EXCEL", url: "vendors/export-to-excel", method: "POST" },
      { name: "VENDORS_EXPORT_TO_INVOICE", url: "vendors/export-to-invoice", method: "POST" },
      { name: "RESET_VENDOR_PASSWORD", url: "vendors/reset-password", method: "POST" },
      { name: "GET_ORDER_DETAILS", url: "vendors/get-order-details", method: "POST" },
      { name: "DEACTIVATE_VENDOR", url: "vendors/deactivate-vendor", method: "POST" },


      { name: "GET_CUSTOMER_DETAILS", url: "customers/get-customer-details", method: "POST" },
      { name: "CUSTOMERS_EXPORT_TO_EXCEL", url: "customers/export-to-excel", method: "POST" },
      { name: "CUSTOMERS_EXPORT_TO_INVOICE", url: "customers/export-to-invoice", method: "POST" },
      { name: "RESET_CUSTOMER_PASSWORD", url: "customers/reset-password", method: "POST" },
      { name: "GET_ORDER_DETAILS", url: "customers/get-order-details", method: "POST" },
      { name: "DEACTIVATE_CUSTOMER", url: "customers/deactivate-customer", method: "POST" },


      { name: "ORDERS_EXPORT_TO_INVOICE", url: "orders/export-to-invoice", method: "POST" },

      { name: "GRABITS_EXPORT_TO_INVOICE", url: "grabits/export-to-invoice", method: "POST" },

      // @@@@@@@@@@@@@@@@@@@@@@ NEW UPDATED API @@@@@@@@@@@@@@@@@@@@@@

      /**
       * USER APIS
       */
      // { name: "USER_REGISTER", url: "users/register", method: "POST" },
      // { name: "LOGIN", url: "users/login", method: "POST" },
      // { name: "GET_USER_LIST_BY_TYPE", url: "users/userlist/", method: "POST" },
      // { name: "UPDATE_USER_API", url: "users/update_user_api", method: "POST" },

      /**
       * PRODUCT APIS
       */

      /**
       * ORDER APIS
       */
      // { name: "CREATE_ORDER", url: "orders/create_list_order", method: "POST" },
      // { name: "GET_ORDER_BY_ID", url: "orders/get_order_by_id", method: "POST" },
      // { name: "DELETE_ORDER_BY_ID", url: "orders/delete_order_by_id", method: "POST" },
      // { name: "UPDATE_ORDER_BY_ID", url: "orders/update_order_by_id", method: "POST" },

      /**
       * OFFER APIS
       */
      // { name: "CREATE_OFFER", url: "offers/create_list_offer", method: "POST" },
      // { name: "GET_OFFER_BY_ID", url: "offers/get_offer_by_id", method: "POST" },
      // { name: "DELETE_OFFER_BY_ID", url: "offers/delete_offer_by_id", method: "POST" },
      // { name: "UPDATE_OFFER_BY_ID", url: "offers/update_offer_by_id", method: "POST" },
      // { name: "OFFERS_LIST", url: "offers/offers_list", method: "POST" },
      // { name: "OFFERS_BY_VENDOR", url: "offers/offers_by_vendor", method: "POST" },

      /**
       * VENDOR APIS
       */
      // { name: "CREATE_VENDOR", url: "vendors/create_vendor", method: "POST" },
      // { name: "GET_VENDOR_BY_ID", url: "vendors/get_vendor_by_id", method: "POST" },
      // { name: "DELETE_VENDOR_BY_ID", url: "vendors/delete_vendor_by_id", method: "POST" },
      // { name: "UPDATE_VENDOR_BY_ID", url: "vendors/update_vendor_by_id", method: "POST" },
      // { name: "VENDORS_LIST", url: "vendors/vendors_list", method: "POST" },

      /**
       * GRABIT PRODUCT APIS
       */
      // { name: "CREATE_GRABIT_PRODUCT", url: "grabits/create_grabit_product", method: "POST" },
      // { name: "GET_GRABIT_PRODUCT_BY_ID", url: "grabits/get_grabit_product_by_id", method: "POST" },
      // { name: "DELETE_GRABIT_PRODUCT_BY_ID", url: "grabits/delete_grabit_product_by_id", method: "POST" },
      // { name: "UPDATE_GRABIT_PRODUCT_BY_ID", url: "grabits/update_grabit_product_by_id", method: "POST" },
      // { name: "GRABIT_PRODUCT_LIST", url: "grabits/grabit_products_list", method: "POST" },

    ];
  }

}
