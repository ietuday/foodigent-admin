import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/core/dialog/confirmation-dialog/confirmation-dialog.component';
import { VendorModel } from 'src/app/core/models/vendor.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AppStorageService } from 'src/app/core/services/authentication/app-storage/app-storage.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { SearchService } from 'src/app/core/services/search/search.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit, AfterViewInit {
  vendorsDisplayedColumns: string[] = ['profile', 'name', 'email', 'desc', 'isSuspended', 'action'];
  vendorsPageIndex: number = 0;
  vendorsPageSize: number = 10;
  vendorsCollectionSize: number = 0;
  vendors = new MatTableDataSource<VendorModel>();
  @ViewChild('vendorsPaginator') vendorsPaginator?: MatPaginator;
  @ViewChild('vendorsSort') vendorsSort?: MatSort;

  placeholder: string = "Search by vendor name";
  searchQuery: string = "";
  sortItem = "name";
  sortOrder = "asc";
  link?: string = "";
  filterTypes: Array<any> = [
    {
      name: "All",
      value: "all"
    },
    {
      name: "Active",
      value: "active"
    },
    {
      name: "Deactive",
      value: "deactive"
    }
  ];
  vendorListSelectedFilter?: any;

  constructor(
    private router: Router,
    private titleService: Title,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private searchService: SearchService,
    private appStorageService: AppStorageService,
    private dialog: MatDialog,
    public authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0;
    this.titleService.setTitle('Foodigent Admin | Vendors');
    this.getSelectedFilterData();
    this.searchService.getVendorSearchData().pipe(debounceTime(1000), distinctUntilChanged()).subscribe((res: any) => {
      console.log("11111 ngOnInit() searchQuery===========", res);
      if (res !== "") {
        this.getVendors();
      }
    });
    this.getVendors();
  }

  ngAfterViewInit() {
    if (this.vendorsSort && this.vendorsPaginator) {
      this.vendors.sort = this.vendorsSort;
      this.vendors.paginator = this.vendorsPaginator;
    }
  }

  /**
   * @description get vendor list data
   */
  getVendors() {
    let filterData = {
      pageNo: this.vendorsPageIndex + 1,
      limit: this.vendorsPageSize,
      sortItem: this.sortItem,
      sortOrder: this.sortOrder,
      searchQuery: this.searchQuery,
      selectedFilter: this.vendorListSelectedFilter
    };
    let postData: ApiParam = {
      data: filterData
    };
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.vendors.data = response.data.companies;
        this.vendorsCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get filtered vendor list data
   * @param event 
   */
  getNewVendors(event: any) {
    console.log("event==========", event);
    this.vendorsPageIndex = event.pageIndex;
    this.vendorsPageSize = event.pageSize;
    this.getVendors();
  }

  /**
   * @description event on sort change
   * @param event 
   */
  sortChange(event: any) {
    console.log("sort event::::::::::::::", event);
    this.sortItem = event.active;
    this.sortOrder = event.direction;
    (this.vendorsPaginator as MatPaginator).pageIndex = 0;
    this.vendorsPageIndex = 0;
    this.searchQuery = "";
    this.setVendorSearchData();
    this.getVendors();
  }

  /**
   * @description navigating to vendor details page
   */
  goToDetailsPage(id: any) {
    this.router.navigate([`/vendors/vendor-details/${id}`]);
  }

  /**
   * @description get vendor list data
   */
  onSearchEvent(value: any) {
    this.searchQuery = value;
    (this.vendorsPaginator as MatPaginator).pageIndex = 0;
    this.vendorsPageIndex = 0;
    this.setVendorSearchData();
  }

  /**
   * @description push data into subject
   */
  setVendorSearchData() {
    const query = this.searchQuery.trim();
    this.searchService.setVendorSearchData(query);
  }

  /**
   * @description export to excel
   */
  exportToExcel() {
    let postData: ApiParam = {
      data: {
        vendorId: '123',
        sortItem: this.sortItem,
        sortOrder: this.sortOrder,
        searchQuery: this.searchQuery,
        selectedFilter: this.vendorListSelectedFilter
      }
    };
    this.loadingService.show();
    this.apiService.request("VENDORS_EXPORT_TO_EXCEL", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.link = response.data.link;
        this.loadingService.hide();
        if (this.link) {
          this.apiService.getPreSignedLink(this.link);
        }
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description on filter selected
   */
  onFilterSelected(value: any) {
    console.log("onFilterSelected() value=========", value);
    if (value !== undefined) {
      this.appStorageService.save('vendor-list-selected-filter', value);
      this.getSelectedFilterData();
      (this.vendorsPaginator as MatPaginator).pageIndex = 0;
      this.vendorsPageIndex = 0;
      this.searchQuery = "";
      this.setVendorSearchData();
      this.getVendors();
    }
  }

  /**
   * @description get selected filtered data
   */
  getSelectedFilterData() {
    if (this.appStorageService.get('vendor-list-selected-filter') !== null) {
      this.vendorListSelectedFilter = this.appStorageService.get('vendor-list-selected-filter');
    } else {
      this.appStorageService.save('vendor-list-selected-filter', "active");
      this.vendorListSelectedFilter = "active";
    }
    console.log("vendor-list-selected-filter===========", this.vendorListSelectedFilter);
  }

  /**
   * @description To activate and deactivate vendor account
   * @param id 
   * @param isActive 
   * @param isActive 
   */
  activateDeactivateVendor(id: string, isActive: boolean = true, name: string): void {
    const deleteDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      // disableClose: true,
      hasBackdrop: true,
      height: "280px",
      width: "480px",
      data: {
        header: `${isActive ? 'Deactivate' : 'Activate'} account?`,
        message: 'Are you sure ?',
        firstButtonText: 'Cancel',
        secondButtonText: isActive ? 'Deactivate' : 'Activate'
      }
    });

    deleteDialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const param: ApiParam = {
          data: {
            userId: id
          }
        };
        this.loadingService.show();
        this.apiService.request('DEACTIVATE_VENDOR', param).subscribe((response: ApiResponse) => {
          this.toastService.activateSuccess(response.data);
          this.loadingService.hide();
        },
          error => {
            this.loadingService.hide();
          }
        );
      }
    });
  }

  /**
   * @description reset vendor password
   * @param id 
   */
  resetPassword(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      // disableClose: true,
      hasBackdrop: true,
      height: "280px",
      width: "480px",
      data: {
        header: 'Reset Password',
        message: 'Reset password link send to email. Are you sure ? ',
        firstButtonText: 'Cancel',
        secondButtonText: 'Send Link'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === "yes") {
        const param: ApiParam = {
          data: {
            id: id
          }
        };
        this.loadingService.show();
        this.apiService.request('RESET_VENDOR_PASSWORD', param).subscribe((response: ApiResponse) => {
          this.toastService.activateSuccess(response.data);
          this.loadingService.hide();
        },
          error => {
            this.loadingService.hide();
          }
        );
      }
    });
  }

}
