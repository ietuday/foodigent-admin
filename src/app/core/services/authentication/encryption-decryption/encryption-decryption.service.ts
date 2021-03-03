import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionDecryptionService {
  encryptSecretKey = environment.encryptSecretKey;

  /**
   * @description apply custom encryption
   * @param item 
   */
  applyCustomEncryption(item: string): string {
    let cypher = '';
    for (const value of item) {
      cypher = cypher + String.fromCharCode(value.charCodeAt(0) - 15);
    }
    return cypher;
  }

  /**
   * @description encrypt data
   * @param data 
   */
  encryptData(data: any): any {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * @description decrypt data
   * @param data 
   */
  decryptData(data: any): any {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }

}
