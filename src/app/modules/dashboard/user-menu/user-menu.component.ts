import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/authentication/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../core/dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  user: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // this.authService.loggedInUser().subscribe(res => {
    //   if (res) {
    //     this.user = res;
    //   }
    // });
  }

  /**
   * @description for logout
   */
  logout(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      // disableClose: true,
      hasBackdrop: true,
      height: "280px",
      width: "480px",
      data: {
        header: 'Confirm Logout',
        message: 'Are you sure you want to log out?',
        firstButtonText: 'Cancel',
        secondButtonText: 'Log out'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "yes") {
        this.authService.logout().subscribe(res => {
          this.router.navigate(['/']);
        });
      }
    });
  }

}
