import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OrderModel } from 'src/app/core/models/order.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit {
  ordersDisplayedColumns: string[] = ['image', 'name', 'date', 'prize', 'action'];
  ordersPageIndex: number = 0;
  ordersPageSize: number = 5;
  ordersCollectionSize: number = 0;
  orders = new MatTableDataSource<OrderModel>();
  @ViewChild('ordersPaginator') ordersPaginator?: MatPaginator;
  @ViewChild('ordersSort') ordersSort?: MatSort;

  rewardOffered = 4001;
  rewardRedeemed = 5617;
  date = new Date();
  link?: string = "";

  constructor(
    private titleService: Title,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private router: Router,
    public authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0;
    this.titleService.setTitle('Foodigent Admin | Orders');
    this.getOrders();
  }

  ngAfterViewInit() {
    if (this.ordersSort && this.ordersPaginator) {
      this.orders.sort = this.ordersSort;
      this.orders.paginator = this.ordersPaginator;
    }
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

  /**
   * @description navigating to order page
   */
  goToDetailsPage(id: any) {
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
    this.apiService.request("ORDERS_EXPORT_TO_INVOICE", postData).subscribe((response: ApiResponse) => {
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

}
