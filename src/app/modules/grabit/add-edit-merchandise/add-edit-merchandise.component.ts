import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchandiseModel } from 'src/app/core/models/merchandise.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-add-edit-merchandise',
  templateUrl: './add-edit-merchandise.component.html',
  styleUrls: ['./add-edit-merchandise.component.scss']
})
export class AddEditMerchandiseComponent implements OnInit {
  merchandiseForm: FormGroup = new FormGroup({});
  merchandiseId: any;
  merchandise: MerchandiseModel = {};
  editMode?: boolean;
  updatedProfilePic: any;
  userUpdated = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.merchandiseId = params.get('id');

      if (this.merchandiseId !== null) {
        this.editMode = true;
        this.getMerchandiseDetails(this.merchandiseId);
      } else {
        this.editMode = false;
      }

      this.titleService.setTitle(`Foodigent Admin | ${this.editMode ? 'Edit' : 'Add'} Merchandise`);
      this.buildForm();
    });
  }

  getMerchandiseDetails(merchandiseId: any) {
    const param: ApiParam = {
      data: {
        companyId: merchandiseId
      }
    };
    this.loadingService.show();
    this.apiService.request("GET_COMPANY_BY_ID", param).subscribe((response: ApiResponse) => {
      this.merchandise = response.data;
      this.loadingService.hide();
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description Build form depending upon requirments
   */
  buildForm() {
    if (this.editMode === true) {
      this.merchandiseForm = this.fb.group({
        name: ['asdfgh', [Validators.required]],
        description: ['asdsa dsfhjds a dshfjs a', [Validators.required]],
        grabitValue: [{ value: 4545, disabled: true }, [Validators.required]],
      });
    } else {
      this.merchandiseForm = this.fb.group({
        name: [null, [Validators.required]],
        description: [null, [Validators.required]],
        grabitValue: [null, [Validators.required]],
      });
    }
  }

  /**
   * @description submiting credentials to server and authenticate
   */
  onSubmit(): void {
    if (this.merchandiseForm.valid) {
      const param: ApiParam = {
        data: {
          name: this.merchandiseForm.value.name,
          description: this.merchandiseForm.value.description,
        }
      };

      if (this.editMode === true) {
        param.data.id = this.merchandise._id;
        this.editMerchandise(param);
      } else {
        param.data.grabitValue = this.merchandiseForm.value.grabitValue
        this.addMerchandise(param);
      }

    } else {
      (this.merchandiseForm.get('name') as AbstractControl).markAsTouched();
      (this.merchandiseForm.get('description') as AbstractControl).markAsTouched();
      (this.merchandiseForm.get('grabitValue') as AbstractControl).markAsTouched();
    }
  }

  /**
   * @description edit merchandise details
   * @param param 
   */
  editMerchandise(param: any) {
    this.loadingService.show();
    this.apiService.request('UPDATE_MERCHANDISE', param).subscribe((response: ApiResponse) => {
      this.loadingService.hide();
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description add merchandise details
   * @param param 
   */
  addMerchandise(param: any) {
    this.loadingService.show();
    this.apiService.request('ADD_MERCHANDISE', param).subscribe((response: ApiResponse) => {
      this.loadingService.hide();
    },
      error => {
        this.loadingService.hide();
      });
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
            this.merchandise.profileUrl = e.target.result;
            this.updatedProfilePic = file;
            this.userUpdated = true;
          };
        })(file);

        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * @description Get back to previous page
   */
  cancel() {
    this.router.navigate(['./grabits/merchandise-list']);
  }

  /**
  * @description check object is empty or not
   * @param object 
   */
  isEmptyObj(object: Object) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

}
