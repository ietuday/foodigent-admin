import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/core/dialog/confirmation-dialog/confirmation-dialog.component';
import { SubscriberModel } from 'src/app/core/models/subscriber.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AppStorageService } from 'src/app/core/services/authentication/app-storage/app-storage.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { SearchService } from 'src/app/core/services/search/search.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-subscriber-list',
  templateUrl: './subscriber-list.component.html',
  styleUrls: ['./subscriber-list.component.scss']
})
export class SubscriberListComponent implements OnInit, AfterViewInit {
  subscribersDisplayedColumns: string[] = ['profile', 'name', 'email', 'desc', 'isSuspended', 'payment period', 'action'];
  subscribersPageIndex: number = 0;
  subscribersPageSize: number = 10;
  subscribersCollectionSize: number = 0;
  subscribers = new MatTableDataSource<SubscriberModel>();
  @ViewChild('subscribersPaginator') subscribersPaginator?: MatPaginator;
  @ViewChild('subscribersSort') subscribersSort?: MatSort;

  date = new Date();
  placeholder: string = "Search by Subscriber";
  searchQuery: string = "";
  sortItem = "name";
  sortOrder = "asc";
  link?: string = "";
  suspendFilterName = "Suspend Option";
  suspendFilterTypes: Array<any> = [
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
  subscriberSuspendSelectedFilter?: any;

  paymentFilterName = "Payment Option";
  paymentFilterTypes: Array<any> = [
    {
      name: "Monthly",
      value: "monthly"
    },
    {
      name: "Annually",
      value: "annually"
    },
    {
      name: "Yearlly",
      value: "yearlly"
    }
  ];
  subscriberPaymentSelectedFilter?: any;

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
    this.titleService.setTitle('Foodigent Admin | Subscribers');
    this.getSelectedFilterData();
    this.searchService.getSubscriberSearchData().pipe(debounceTime(1000), distinctUntilChanged()).subscribe((res: any) => {
      console.log("11111 ngOnInit() searchQuery===========", res);
      if (res !== "") {
        this.getSubscribers();
      }
    });
    this.getSubscribers();
  }

  ngAfterViewInit() {
    if (this.subscribersSort && this.subscribersPaginator) {
      this.subscribers.sort = this.subscribersSort;
      this.subscribers.paginator = this.subscribersPaginator;
    }
  }

  /**
   * @description get subscriber list data
   */
  getSubscribers() {
    let filterData = {
      pageNo: this.subscribersPageIndex + 1,
      limit: this.subscribersPageSize,
      sortItem: this.sortItem,
      sortOrder: this.sortOrder,
      searchQuery: this.searchQuery,
      suspendSelectedFilter: this.subscriberSuspendSelectedFilter,
      paymentSelectedFilter: this.subscriberPaymentSelectedFilter
    };
    let postData: ApiParam = {
      data: filterData
    };
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.subscribers.data = response.data.companies;
        this.subscribersCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get filtered subscriber list data
   * @param event 
   */
  getNewSubscribers(event: any) {
    console.log("event==========", event);
    this.subscribersPageIndex = event.pageIndex;
    this.subscribersPageSize = event.pageSize;
    this.getSubscribers();
  }

  /**
   * @description event on sort change
   * @param event 
   */
  sortChange(event: any) {
    console.log("sort event::::::::::::::", event);
    this.sortItem = event.active;
    this.sortOrder = event.direction;
    (this.subscribersPaginator as MatPaginator).pageIndex = 0;
    this.subscribersPageIndex = 0;
    this.searchQuery = "";
    this.setSubscriberSearchData();
    this.getSubscribers();
  }

  /**
   * @description navigating to subscriber details page
   */
  goToDetailsPage(id: any) {
    this.router.navigate([`/subscribers/subscriber-details/${id}`]);
  }

  /**
   * @description get subscriber list data
   */
  onSearchEvent(value: any) {
    this.searchQuery = value;
    (this.subscribersPaginator as MatPaginator).pageIndex = 0;
    this.subscribersPageIndex = 0;
    this.setSubscriberSearchData();
  }

  /**
   * @description push data into subject
   */
  setSubscriberSearchData() {
    const query = this.searchQuery.trim();
    this.searchService.setSubscriberSearchData(query);
  }

  /**
   * @description export to excel
   */
  exportToExcel() {
    let postData: ApiParam = {
      data: {
        subscriberId: '123',
        sortItem: this.sortItem,
        sortOrder: this.sortOrder,
        searchQuery: this.searchQuery,
        suspendSelectedFilter: this.subscriberSuspendSelectedFilter,
        paymentSelectedFilter: this.subscriberPaymentSelectedFilter
      }
    };
    this.loadingService.show();
    this.apiService.request("SUBSCRIBER_EXPORT_TO_EXCEL", postData).subscribe((response: ApiResponse) => {
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
   * @description export to pdf
   */
  exportToPdf() {
    let postData: ApiParam = {
      data: {
        subscriberId: '123',
        sortItem: this.sortItem,
        sortOrder: this.sortOrder,
        searchQuery: this.searchQuery,
        suspendSelectedFilter: this.subscriberSuspendSelectedFilter,
        paymentSelectedFilter: this.subscriberPaymentSelectedFilter
      }
    };
    this.loadingService.show();
    this.apiService.request("SUBSCRIBER_EXPORT_TO_PDF", postData).subscribe((response: ApiResponse) => {
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
  onSuspendFilterSelected(value: any) {
    console.log("onSuspendFilterSelected() value=========", value);
    if (value !== undefined) {
      this.appStorageService.save('subscriber-suspend-selected-filter', value);
      this.getSelectedFilterData();
      (this.subscribersPaginator as MatPaginator).pageIndex = 0;
      this.subscribersPageIndex = 0;
      this.searchQuery = "";
      this.setSubscriberSearchData();
      this.getSubscribers();
    }
  }

  /**
   * @description on filter selected
   */
  onPaymentFilterSelected(value: any) {
    console.log("onPaymentFilterSelected() value=========", value);
    if (value !== undefined) {
      this.appStorageService.save('subscriber-payment-selected-filter', value);
      this.getSelectedFilterData();
      (this.subscribersPaginator as MatPaginator).pageIndex = 0;
      this.subscribersPageIndex = 0;
      this.searchQuery = "";
      this.setSubscriberSearchData();
      this.getSubscribers();
    }
  }

  /**
   * @description get selected filtered data
   */
  getSelectedFilterData() {
    if ((this.appStorageService.get('subscriber-suspend-selected-filter') !== null) && (this.appStorageService.get('subscriber-suspend-selected-filter') !== null)) {
      this.subscriberSuspendSelectedFilter = this.appStorageService.get('subscriber-suspend-selected-filter');
      this.subscriberPaymentSelectedFilter = this.appStorageService.get('subscriber-payment-selected-filter');
    } else {
      this.appStorageService.save('subscriber-suspend-selected-filter', "active");
      this.subscriberSuspendSelectedFilter = "active";

      this.appStorageService.save('subscriber-payment-selected-filter', "monthly");
      this.subscriberPaymentSelectedFilter = "monthly";
    }
    console.log("subscriber-suspend-selected-filter===========", this.subscriberSuspendSelectedFilter);
    console.log("subscriber-payment-selected-filter===========", this.subscriberPaymentSelectedFilter);
  }

  /**
   * @description To activate and deactivate subscriber account
   * @param id 
   * @param isActive 
   * @param isActive 
   */
  activateDeactivateSubscriber(id: string, isActive: boolean = true, name: string): void {
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
        this.apiService.request('DEACTIVATE_SUBSCRIBER', param).subscribe((response: ApiResponse) => {
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
   * @description reset subscriber password
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
        this.apiService.request('RESET_SUBSCRIBER_PASSWORD', param).subscribe((response: ApiResponse) => {
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
