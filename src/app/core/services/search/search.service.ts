import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  /**
   * vendor page related
   */
  vendorSearchData = new Subject<any>();

  /**
   * @description set value to subject
   * @param query 
   */
  setVendorSearchData(query: any) {
    this.vendorSearchData.next(query);
  }

  /**
   * @description get value to subject
   */
  getVendorSearchData() {
    return this.vendorSearchData;
  }

  /**
   * customer page related
   */
  customerSearchData = new Subject<any>();

  /**
   * @description set value to subject
   * @param query 
   */
  setCustomerSearchData(query: any) {
    this.customerSearchData.next(query);
  }

  /**
   * @description get value to subject
   */
  getCustomerSearchData() {
    return this.customerSearchData;
  }

  /**
   * merchandise page related
   */
  merchandiseSearchData = new Subject<any>();

  /**
   * @description set value to subject
   * @param query 
   */
  setMerchandiseSearchData(query: any) {
    this.merchandiseSearchData.next(query);
  }

  /**
   * @description get value to subject
   */
  getMerchandiseSearchData() {
    return this.merchandiseSearchData;
  }

}
