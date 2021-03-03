import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ConfirmationDialogComponent } from 'src/app/core/dialog/confirmation-dialog/confirmation-dialog.component';
import { UserModel } from 'src/app/core/models/user.model';
import { ToastService } from 'src/app/core/services/toast/toast.service';

interface FileData {
  name: string;
  link: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: UserModel = {
    profileUrl: 'assets/images/users/user.jpg'
  };
  editMode = true;
  updatedProfilePic: any;
  userUpdated = false;

  // for attachments
  selectedAttachments: string[] = [];
  newUploadedAttachments: File[] = [];
  fileNames: Array<FileData> = [];
  // deleteDialogRef: MatDialogRef<DeleteDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private toastService: ToastService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("iGrab Admin | Profile");
  }

  /**
   * @description After profile selected
   * @param event
   */
  onProfilePicSelected(event: any) {
    const file: File = event.files['0'];
    if (file) {
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = ((theFile) => {
          return (e: any) => {
            this.user.profileUrl = e.target.result;
            this.updatedProfilePic = file;
            this.userUpdated = true;
          };
        })(file);

        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * @description on File Slection
   * @param event
   */
  onFileInput(event: File[] | any) {
    if (event != undefined) {
      if (event['files'].length <= 5 || this.selectedAttachments.length <= 5) {
        for (let file of event['files']) {
          if (this.selectedAttachments.length < 5 && this.newUploadedAttachments.length < (5 - this.selectedAttachments.length)) {
            if (file.size <= 5242880) {
              if (file.type.includes('pdf') || file.type === 'image/png' || file.type === 'image/jpeg') {
                this.newUploadedAttachments.push(file);
                this.userUpdated = true;
              } else {
                this.toastService.activateError(`Format is not supported for ${file.name}`)
              }
            } else {
              this.toastService.activateError(`File size of ${file.name} is too big. Maximum size limit is 5MB`)
            }
          } else {
            this.toastService.activateError('Maximum attachments selection limit reached : You can select upto 5 documents ');
            break;
          }
        }
      } else {
        this.toastService.activateError('Maximum attachments selection limit reached : You can select upto 5 documents ');
      }
    }
  }

  /**
   * @description Remove Attachment of a user
   * @param index
   * @param type
   */
  removeAttachment(index: number, type: string) {
    let fileName = '';
    if (this.newUploadedAttachments.length) {
      console.log("222 this.newUploadedAttachments========", this.newUploadedAttachments);


      // if (type === 'name') {
      //   fileName = this.fileNames[index].name;
      // } else {
        fileName = this.newUploadedAttachments[index].name;
      // }
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      // disableClose: true,
      hasBackdrop: true,
      height: "280px",
      width: "480px",
      data: {
        header: 'Delete Attachment',
        message: `Are you sure you want to delete ${fileName} ?`,
        firstButtonText: 'Cancel',
        secondButtonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "yes") {
        if ((this.selectedAttachments.length + this.newUploadedAttachments.length) > 1) {
          // if (type === 'name') {
          //   this.selectedAttachments.splice(index, 1);
          //   this.fileNames.splice(index, 1);
          //   this.userUpdated = true;
          // } else {
            this.newUploadedAttachments.splice(index, 1);
            this.userUpdated = true;
          // }
        } else {
          this.toastService.activateError('Atleast one attachment required, So we can\'t delete it')
        }
      }
    });
  }

}
