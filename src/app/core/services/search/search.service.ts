import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  /**
   * subscriber page related
   */
  subscriberSearchData = new Subject<any>();

  /**
   * @description set value to subject
   * @param query 
   */
  setSubscriberSearchData(query: any) {
    this.subscriberSearchData.next(query);
  }

  /**
   * @description get value to subject
   */
  getSubscriberSearchData() {
    return this.subscriberSearchData;
  }

}
