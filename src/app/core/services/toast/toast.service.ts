import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomToastComponent } from '../../components/custom-toast/custom-toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) { }

  /**
   * @description show success snakbar
   * @param message message to shown
   */
  public activateSuccess(message: string): void {
    this.zone.run(() => {
      const snackBar = this.snackBar.openFromComponent(CustomToastComponent, {
        data: {
          class: 'custom-toast sucess-toast',
          message: message
        },
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        duration: 3000
      });
      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      });
    });
  }

  /**
   * @description show error snakbar
   * @param message message to shown
   */
  public activateError(message: string): void {
    this.zone.run(() => {
      const snackBar = this.snackBar.openFromComponent(CustomToastComponent, {
        data: {
          class: 'custom-toast error-toast',
          message: message
        },
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        duration: 3000
      });
      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      });
    });
  }

}
