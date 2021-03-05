import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DateRangeType } from 'src/app/core/interfaces/date-range-type';
import { OrderModel } from 'src/app/core/models/order.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit, AfterViewInit {
  vendorOrdersDisplayedColumns: string[] = ['profile', 'name', 'desc', 'date', 'payment', 'action'];
  vendorOrdersPageIndex: number = 0;
  vendorOrdersPageSize: number = 10;
  vendorOrdersCollectionSize: number = 0;
  vendorOrders = new MatTableDataSource<OrderModel>();
  @ViewChild('vendorOrdersPaginator') vendorOrdersPaginator?: MatPaginator;
  @ViewChild('vendorOrdersSort') vendorOrdersSort?: MatSort;

  vendorId: any;
  link?: string = "";
  date = new Date();
  filterTypes: Array<any> = [
    {
      name: "All Payments",
      value: "all"
    },
    {
      name: "Success Payments",
      value: "success"
    },
    {
      name: "Failed Payments",
      value: "failed"
    }
  ];
  selectedFilterData = "all";
  categories = [
    {
      name: "Todays",
      value: "today"
    },
    {
      name: "Current Week",
      value: "current week"
    },
    {
      name: "Last Week",
      value: "last week"
    },
    {
      name: "Current Month",
      value: "current month"
    },
    {
      name: "Last Month",
      value: "last month"
    }
  ];
  selectedCategory = "today";
  today = new Date();
  day = this.today.getDate();
  month = this.today.getMonth();
  year = this.today.getFullYear();
  previousMonth = this.month - 1;
  data = {
    day: this.day,
    month: this.month,
    year: this.year,
    previousMonth: this.previousMonth
  };
  dateRangeData?: DateRangeType = {
    start: {
      day: this.data.day,
      month: this.data.previousMonth + 1,
      year: this.data.year
    },
    end: {
      day: this.data.day,
      month: this.data.month + 1,
      year: this.data.year
    }
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private router: Router,
    private dialog: MatDialog,
    public authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Foodigent Admin | Vendor Details');

    this.activatedRoute.paramMap.subscribe(params => {
      this.vendorId = params.get('id');
      this.getOrders();
    });
  }

  ngAfterViewInit() {
    if (this.vendorOrdersSort && this.vendorOrdersPaginator) {
      this.vendorOrders.sort = this.vendorOrdersSort;
      this.vendorOrders.paginator = this.vendorOrdersPaginator;
    }
  }

  /**
   * @description get vendor list data
   */
  getOrders() {
    let filterData = {
      pageNo: this.vendorOrdersPageIndex + 1,
      limit: this.vendorOrdersPageSize,
      selectedFilter: this.selectedFilterData,
      dateRangeData: this.dateRangeData,
      selectedCategory: this.selectedCategory
    };
    let postData: ApiParam = {
      data: filterData
    }
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.vendorOrders.data = response.data.companies;
        this.vendorOrdersCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get fi;tered vendor list data
   * @param event 
   */
  getNewOrders(event: any) {
    console.log("event==========", event);
    this.vendorOrdersPageIndex = event.pageIndex;
    this.vendorOrdersPageSize = event.pageSize;
    this.getOrders();
  }

  /**
   * @description navigating to vendor details page
   */
  goToOrderDetailsPage(id: any) {
    this.router.navigate([`/orders/order-details/${id}`]);
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
    this.apiService.request("VENDORS_EXPORT_TO_INVOICE", postData).subscribe((response: ApiResponse) => {
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
      this.selectedFilterData = value;
      (this.vendorOrdersPaginator as MatPaginator).pageIndex = 0;
      this.vendorOrdersPageIndex = 0;
      this.getOrders();
    }
  }

  /**
   * @description on date range change
   * @param event 
   */
  onDateRangeChange(event: DateRangeType) {
    this.dateRangeData = event;
    (this.vendorOrdersPaginator as MatPaginator).pageIndex = 0;
    this.vendorOrdersPageIndex = 0;
    this.getOrders();
  }

  /**
   * @description on category select
   * @param value 
   */
  onCategorySelect(value: any) {
    this.selectedCategory = value;
    (this.vendorOrdersPaginator as MatPaginator).pageIndex = 0;
    this.vendorOrdersPageIndex = 0;
    this.getOrders();
  }

}
