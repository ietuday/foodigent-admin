import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, AfterViewInit {
  offersDisplayedColumns: string[] = ["image", "name", "prize"];
  offersPageIndex: number = 0;
  offersPageSize: number = 5;
  offersCollectionSize: number = 0;
  offers = new MatTableDataSource<any>();
  @ViewChild('offersPaginator') offersPaginator?: MatPaginator;
  @ViewChild('offersSort') offersSort?: MatSort;

  grabitsDisplayedColumns: string[] = ["image", "name", "name2", "name3", "prize"];
  grabitsPageIndex: number = 0;
  grabitsPageSize: number = 5;
  grabitsCollectionSize: number = 0;
  grabits = new MatTableDataSource<any>();
  @ViewChild('grabitsPaginator') grabitsPaginator?: MatPaginator;
  @ViewChild('grabitsSort') grabitsSort?: MatSort;

  ordersDisplayedColumns: string[] = ["image", "name", "prize"];
  ordersPageIndex: number = 0;
  ordersPageSize: number = 5;
  ordersCollectionSize: number = 0;
  orders = new MatTableDataSource<any>();
  @ViewChild('ordersPaginator') ordersPaginator?: MatPaginator;
  @ViewChild('ordersSort') ordersSort?: MatSort;

  customerId: any;
  customer: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private router: Router,
    public authService: AuthService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0;
    this.titleService.setTitle('Foodigent Admin | Customer Details');

    this.activatedRoute.paramMap.subscribe(params => {
      this.customerId = params.get('id');
      console.log("this.customerId=============", this.customerId);

      // remove comment later when need
      // this.getCustomerDetails(this.customerId);
      this.getOffers();
      this.getGrabits();
      this.getOrders();
    });
  }

  ngAfterViewInit() {
    if (this.offersSort && this.offersPaginator && this.grabitsSort && this.grabitsPaginator && this.ordersSort && this.ordersPaginator) {
      this.offers.sort = this.offersSort;
      this.offers.paginator = this.offersPaginator;
      this.grabits.sort = this.grabitsSort;
      this.grabits.paginator = this.grabitsPaginator;
      this.orders.sort = this.ordersSort;
      this.orders.paginator = this.ordersPaginator;
    }
  }

  /**
   * @description get vendor list data
   */
  getCustomerDetails(customerId: any) {
    let filterData = {
      id: customerId
    };
    let postData: ApiParam = {
      data: filterData
    };
    this.loadingService.show();
    this.apiService.request("GET_CUSTOMER_DETAILS", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.customer = response.data;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get product list
   */
  getOffers() {
    let filterData = {
      pageNo: this.offersPageIndex + 1,
      limit: this.offersPageSize
    };
    let postData: ApiParam = {
      data: filterData
    }
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.offers.data = response.data.companies;
        this.offersCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get next product list
   * @param event 
   */
  getNewOffers(event: any) {
    this.offersPageIndex = event.pageIndex;
    this.offersPageSize = event.pageSize;
    this.getOffers();
  }

  /**
   * @description get grabits list
   */
  getGrabits() {
    let filterData = {
      pageNo: this.grabitsPageIndex + 1,
      limit: this.grabitsPageSize
    };
    let postData: ApiParam = {
      data: filterData
    }
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.grabits.data = response.data.companies;
        this.grabitsCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get next grabits list
   * @param event 
   */
  getNewGrabits(event: any) {
    this.grabitsPageIndex = event.pageIndex;
    this.grabitsPageSize = event.pageSize;
    this.getGrabits();
  }

  /**
   * @description get orders list
   */
  getOrders() {
    let filterData = {
      pageNo: this.ordersPageIndex + 1,
      limit: this.ordersPageSize
    };
    let postData: ApiParam = {
      data: filterData
    }
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.orders.data = response.data.companies;
        this.ordersCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get next orders list
   * @param event 
   */
  getNewOrders(event: any) {
    this.ordersPageIndex = event.pageIndex;
    this.ordersPageSize = event.pageSize;
    this.getOrders();
  }

}
