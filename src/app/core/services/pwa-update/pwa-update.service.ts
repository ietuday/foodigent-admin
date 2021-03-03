import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  constructor(
    private update: SwUpdate,
    private dialog: MatDialog
  ) {
    if (update.isEnabled) {
      interval(6 * 60 * 60 * 1000).subscribe(() => update.checkForUpdate()
        .then(result => {
          console.log('checking for updates', result);
        })
        .catch(error => {
          console.error(error);
        })
      );
    }
  }

  activateUpdate() {
    this.update.available.subscribe((event) => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
        // hasBackdrop: true,
        height: "280px",
        width: "480px",
        data: {
          header: 'Update Alert',
          message: 'Update available for app please confirm',
          // firstButtonText: 'Cancel',
          secondButtonText: 'Update'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === "yes") {
          this.update.activateUpdate()
            .then(() => {
              document.location.reload();
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    });
  }

}
