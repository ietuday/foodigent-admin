import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { ApiResponse, ApiService } from '../api/api.service';
import { EncryptionDecryptionService } from '../authentication/encryption-decryption/encryption-decryption.service';
import { AWSCredentials } from '../../interfaces/aws-credentials';

@Injectable({
  providedIn: 'root'
})
export class S3BucketService {
  awsCredentials: AWSCredentials = {
    accessKeyId: "",
    region: "",
    secretAccessKey: "",
    bucketName: ""
  };

  constructor(
    private apiService: ApiService,
    private encryptionDecryptionService: EncryptionDecryptionService
  ) {
    this.apiService.request('GET_S3_CREDENTIAL').subscribe((response: ApiResponse) => {
      this.awsCredentials.accessKeyId = this.encryptionDecryptionService.applyCustomEncryption(response.data.accessKeyId);
      this.awsCredentials.region = this.encryptionDecryptionService.applyCustomEncryption(response.data.region);
      this.awsCredentials.secretAccessKey = this.encryptionDecryptionService.applyCustomEncryption(response.data.secretAccessKey);
      this.awsCredentials.bucketName = this.encryptionDecryptionService.applyCustomEncryption(response.data.bucketName);
    });
  }

  /**
   * @description return s3 bucket instance
   */
  private getS3Bucket(): S3 {
    const bucket = new S3(this.awsCredentials);
    return bucket;
  }

  /**
   * @description for upload file to the s3 bucket
   * @param file 
   */
  uploadFile(file: File) {
    const contentType = file.type;

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.awsCredentials.bucketName ? this.awsCredentials.bucketName : '',
      Key: file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };

    this.getS3Bucket().upload(params, function (err: Error, data: S3.ManagedUpload.SendData) {
      if (err) {
        console.log('EROOR: ', JSON.stringify(err));
        return false;
      }
      console.log('File Uploaded.', data);
      return true;
    });
  }

  /**
   * @description for delete file from the s3 bucket
   * @param file 
   */
  deleteFile(file: File) {
    const params: S3.Types.DeleteObjectRequest = {
      Bucket: this.awsCredentials.bucketName ? this.awsCredentials.bucketName : '',
      Key: file.name
    };

    this.getS3Bucket().deleteObject(params, function (err: AWS.AWSError, data: S3.Types.DeleteObjectOutput) {
      if (err) {
        console.log('EROOR: ', JSON.stringify(err));
        return false;
      }
      console.log('Successfully deleted', data);
      return true;
    });
  }

}
