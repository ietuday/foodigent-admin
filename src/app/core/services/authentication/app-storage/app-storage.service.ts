import { Injectable, Optional, SkipSelf } from '@angular/core';

interface StorageItem {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  private items: Array<StorageItem> = Array<StorageItem>();
  private isInitalized = false;
  private appStorageKey = 'app_storage_items';

  constructor(
    @Optional() @SkipSelf() prior: AppStorageService
  ) {
    if (prior) {
      return prior;
    }
    this.loadItemsFromLocalStroge();
    this.isInitalized = true;
  }

  /**
   * @description get
   * @param key
   */
  get<T>(key: string): T | null {
    const item = this.items.find(items => items.key === key);
    if (!item) {
      return null;
    }
    return JSON.parse(item.value) as T;
  }

  /**
   * @description save
   * @param- key
   * @param- value
   */
  save<T>(key: string, value: T): void {
    let isExist = false;
    const itemValue = JSON.stringify(value);
    this.items.map(item => {
      if (item.key === key) {
        isExist = true;
        item.value = itemValue;
      }
    });
    if (!isExist) {
      this.items.push({ key, value: itemValue });
    }
    this.saveItemsToLocalStorage();
  }

  /**
   * @description clear storage
   */
  clear(): void {
    localStorage.removeItem(this.appStorageKey);
    this.items = Array<StorageItem>();
  }

  /**
   * @description load items from local storage
   */
  private loadItemsFromLocalStroge(): void {
    const items = localStorage.getItem(this.appStorageKey);
    this.items = (items !== null) ? JSON.parse(items) : [];
  }

  /**
   * @description save items to local storage
   */
  private saveItemsToLocalStorage(): void {
    const items = JSON.stringify(this.items);
    localStorage.setItem(this.appStorageKey, items);
  }

  /**
   * @description save extra item
   * @param key key
   * @param value value
   */
  public saveExtraItem(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  /**
   * @description get extra item
   * @param key  key
   */
  public getExtraItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * @description remove extra item
   * @param key key
   */
  public removeExtraItem(key: string): void {
    localStorage.removeItem(key);
  }

}
