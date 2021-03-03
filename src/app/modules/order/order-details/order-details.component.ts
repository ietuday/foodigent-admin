import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from 'src/app/core/models/product.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, AfterViewInit {
  productsDisplayedColumns: string[] = ['image', 'name', 'prize'];
  productsPageIndex: number = 0;
  productsPageSize: number = 5;
  productsCollectionSize: number = 0;
  products = new MatTableDataSource<ProductModel>();
  @ViewChild('productsPaginator') productsPaginator?: MatPaginator;
  @ViewChild('productsSort') productsSort?: MatSort;

  orderId: any;
  order: any;

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
    this.titleService.setTitle('iGrab Admin | Order Details');

    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = params.get('id');
      console.log("this.orderId=============", this.orderId);

      // remove comment later when need
      // this.getOrderDetails(this.orderId);
      this.getProducts();
    });
  }

  ngAfterViewInit() {
    if (this.productsSort && this.productsPaginator) {
      this.products.sort = this.productsSort;
      this.products.paginator = this.productsPaginator;
    }
  }

  /**
   * @description get vendor list data
   */
  getOrderDetails(orderId: any) {
    let filterData = {
      id: orderId
    };
    let postData: ApiParam = {
      data: filterData
    };
    this.loadingService.show();
    this.apiService.request("GET_ORDER_DETAILS", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.order = response.data;
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
  getProducts() {
    let filterData = {
      pageNo: this.productsPageIndex + 1,
      limit: this.productsPageSize
    };
    let postData: ApiParam = {
      data: filterData
    }
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.products.data = response.data.companies;
        this.productsCollectionSize = response.data.totalCount;
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
  getNewProducts(event: any) {
    this.productsPageIndex = event.pageIndex;
    this.productsPageSize = event.pageSize;
    this.getProducts();
  }

}
