import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentHistoryModel } from 'src/app/core/models/payment-history.model';
import { SubscriberModel } from 'src/app/core/models/subscriber.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-subscriber-details',
  templateUrl: './subscriber-details.component.html',
  styleUrls: ['./subscriber-details.component.scss']
})
export class SubscriberDetailsComponent implements OnInit {
  paymentHistoroiesDisplayedColumns: string[] = ['name', 'date', 'prize', 'status'];
  paymentHistoroiesPageIndex: number = 0;
  paymentHistoroiesPageSize: number = 5;
  paymentHistoroiesCollectionSize: number = 0;
  paymentHistoroies = new MatTableDataSource<PaymentHistoryModel>();
  @ViewChild('paymentHistoroiesPaginator') paymentHistoroiesPaginator?: MatPaginator;
  @ViewChild('paymentHistoroiesSort') paymentHistoroiesSort?: MatSort;

  subscriberId: any;
  subscriber?: SubscriberModel;
  date = new Date();

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
    this.titleService.setTitle('Foodigent Admin | Subscriber Details');

    this.activatedRoute.paramMap.subscribe(params => {
      this.subscriberId = params.get('id');
      console.log("this.subscriberId=============", this.subscriberId);

      // remove comment later when need
      // this.getSubscriberDetailsById(this.subscriberId);
      this.getPaymentHistoriesBySubscriber();
    });
  }

  ngAfterViewInit() {
    if (this.paymentHistoroiesSort && this.paymentHistoroiesPaginator) {
      this.paymentHistoroies.sort = this.paymentHistoroiesSort;
      this.paymentHistoroies.paginator = this.paymentHistoroiesPaginator;
    }
  }

  /**
   * @description get subscriber details by id
   */
  getSubscriberDetailsById(subscriberId: any) {
    let filterData = {
      subscriberId: subscriberId
    };
    let postData: ApiParam = {
      data: filterData
    };
    this.loadingService.show();
    this.apiService.request("GET_SUBSCRIBER_DETAILS_BY_ID", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.subscriber = response.data;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get payment history by subscriber
   */
  getPaymentHistoriesBySubscriber() {
    let filterData = {
      subscriberId: this.subscriberId,
      pageNo: this.paymentHistoroiesPageIndex + 1,
      limit: this.paymentHistoroiesPageSize
    };
    let postData: ApiParam = {
      data: filterData
    }
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.paymentHistoroies.data = response.data.companies;
        this.paymentHistoroiesCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get next payment history
   * @param event 
   */
  getNewPaymentHistories(event: any) {
    this.paymentHistoroiesPageIndex = event.pageIndex;
    this.paymentHistoroiesPageSize = event.pageSize;
    this.getPaymentHistoriesBySubscriber();
  }

}
