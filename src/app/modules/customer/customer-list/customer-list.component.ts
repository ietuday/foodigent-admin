import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/core/dialog/confirmation-dialog/confirmation-dialog.component';
import { CustomerModel } from 'src/app/core/models/customer.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AppStorageService } from 'src/app/core/services/authentication/app-storage/app-storage.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { SearchService } from 'src/app/core/services/search/search.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  customersDisplayedColumns: string[] = ['profile', 'name', 'email', "desc", "isSuspended", "action"];
  customersPageIndex: number = 0;
  customersPageSize: number = 5;
  customersCollectionSize: number = 0;
  customers = new MatTableDataSource<CustomerModel>();
  @ViewChild('customersPaginator') customersPaginator?: MatPaginator;
  @ViewChild('customersSort') customersSort?: MatSort;

  placeholder: string = "Search by customer name";
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
  customerListSelectedFilter?: any;

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
    this.titleService.setTitle('iGrab Admin | Customers');
    this.getSelectedFilterData();
    this.searchService.getCustomerSearchData().pipe(debounceTime(1000), distinctUntilChanged()).subscribe((res: any) => {
      console.log("11111 ngOnInit() searchQuery===========", res);
      if (res !== "") {
        this.getCustomers();
      }
    });
    this.getCustomers();
  }

  ngAfterViewInit() {
    if (this.customersSort && this.customersPaginator) {
      this.customers.sort = this.customersSort;
      this.customers.paginator = this.customersPaginator;
    }
  }

  /**
   * @description get customers data
   */
  getCustomers() {
    let filterData = {
      pageNo: this.customersPageIndex + 1,
      limit: this.customersPageSize,
      sortItem: this.sortItem,
      sortOrder: this.sortOrder,
      searchQuery: this.searchQuery,
      selectedFilter: this.customerListSelectedFilter
    };
    let postData: ApiParam = {
      data: filterData
    };
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.customers.data = response.data.companies;
        this.customersCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get filtered customer list data
   * @param event 
   */
  getNewCustomers(event: any) {
    console.log("event==========", event);
    this.customersPageIndex = event.pageIndex;
    this.customersPageSize = event.pageSize;
    this.getCustomers();
  }

  /**
   * @description event on sort change
   * @param event 
   */
  sortChange(event: any) {
    console.log("sort event::::::::::::::", event);
    this.sortItem = event.active;
    this.sortOrder = event.direction;
    (this.customersPaginator as MatPaginator).pageIndex = 0;
    this.customersPageIndex = 0;
    this.searchQuery = "";
    this.setCustomerSearchData();
    this.getCustomers();
  }

  /**
   * @description navigating to customer details page
   */
  goToDetailsPage(id: any) {
    this.router.navigate([`/customers/customer-details/${id}`]);
  }

  /**
   * @description get customer list data
   */
  onSearchEvent(value: any) {
    this.searchQuery = value;
    (this.customersPaginator as MatPaginator).pageIndex = 0;
    this.customersPageIndex = 0;
    this.setCustomerSearchData();
  }

  /**
   * @description push data into subject
   */
  setCustomerSearchData() {
    const query = this.searchQuery.trim();
    this.searchService.setCustomerSearchData(query);
  }

  /**
   * @description export to excel
   */
  exportToExcel() {
    let postData: ApiParam = {
      data: {
        customerId: '123',
        sortItem: this.sortItem,
        sortOrder: this.sortOrder,
        searchQuery: this.searchQuery,
        selectedFilter: this.customerListSelectedFilter
      }
    }
    this.loadingService.show();
    this.apiService.request("CUSTOMERS_EXPORT_TO_EXCEL", postData).subscribe((response: ApiResponse) => {
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
   * @description export to invoice
   */
  exportToInvoice(id: any) {
    let postData: ApiParam = {
      data: {
        id: id
      }
    }
    this.loadingService.show();
    this.apiService.request("CUSTOMERS_EXPORT_TO_INVOICE", postData).subscribe((response: ApiResponse) => {
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
      this.appStorageService.save('customer-list-selected-filter', value);
      this.getSelectedFilterData();
      (this.customersPaginator as MatPaginator).pageIndex = 0;
      this.customersPageIndex = 0;
      this.searchQuery = "";
      this.setCustomerSearchData();
      this.getCustomers();
    }
  }

  /**
   * @description get selected filtered data
   */
  getSelectedFilterData() {
    if (this.appStorageService.get('customer-list-selected-filter') !== null) {
      this.customerListSelectedFilter = this.appStorageService.get('customer-list-selected-filter');
    } else {
      this.appStorageService.save('customer-list-selected-filter', "active");
      this.customerListSelectedFilter = "active";
    }
    console.log("customer-list-selected-filter===========", this.customerListSelectedFilter);
  }

  /**
   * @description To activate and deactivate customer account
   * @param id 
   * @param isActive 
   * @param isActive 
   */
  activateDeactivateCustomer(id: string, isActive: boolean = true, name: string): void {
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
        this.apiService.request('DEACTIVATE_CUSTOMER', param).subscribe((response: ApiResponse) => {
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
   * @description reset customer password
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
        this.apiService.request('RESET_CUSTOMER_PASSWORD', param).subscribe((response: ApiResponse) => {
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
