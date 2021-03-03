import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-warning',
  templateUrl: './common-warning.component.html',
  styleUrls: ['./common-warning.component.scss']
})
export class CommonWarningComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, body: string, buttonText: string }
  ) { }

  ngOnInit(): void {
  }

  /**
   * @description close on success
   */
  success() {
    this.dialogRef.close('yes');
  }

}
