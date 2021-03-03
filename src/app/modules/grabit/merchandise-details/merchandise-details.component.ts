import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { GrabitModel } from 'src/app/core/models/grabit.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-merchandise-details',
  templateUrl: './merchandise-details.component.html',
  styleUrls: ['./merchandise-details.component.scss']
})
export class MerchandiseDetailsComponent implements OnInit, AfterViewInit {
  grabitsDisplayedColumns: string[] = ["image", "name", "date", "prize", "action"];
  grabitsPageIndex: number = 0;
  grabitsPageSize: number = 5;
  grabitsCollectionSize: number = 0;
  grabits = new MatTableDataSource<GrabitModel>();
  @ViewChild('grabitsPaginator') grabitsPaginator?: MatPaginator;
  @ViewChild('grabitsSort') grabitsSort?: MatSort;

  merchandiseId: any;
  rewardOffered = 4001;
  rewardRedeemed = 5617;
  date = new Date();
  link?: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private router: Router,
    public authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    document.documentElement.scrollTop = 0;
    this.titleService.setTitle('iGrab Admin | Merchandise Details');

    this.activatedRoute.paramMap.subscribe(params => {
      this.merchandiseId = params.get('id');
      this.getGrabits();
    });
  }

  ngAfterViewInit() {
    if (this.grabitsSort && this.grabitsPaginator) {
      this.grabits.sort = this.grabitsSort;
      this.grabits.paginator = this.grabitsPaginator;
    }
  }

  /**
   * @description get orders list
   */
  getGrabits() {
    let filterData = {
      pageNo: this.grabitsPageIndex + 1,
      limit: this.grabitsPageSize,
      merchandiseId: this.merchandiseId
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
   * @description get next orders list
   * @param event 
   */
  getNewGrabits(event: any) {
    this.grabitsPageIndex = event.pageIndex;
    this.grabitsPageSize = event.pageSize;
    this.getGrabits();
  }

  /**
   * @description navigating to order page
   */
  goToDetailsPage(id: any) {
    // this.router.navigate([`/orders/order-details/${id}`]);
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
    this.apiService.request("GRABITS_EXPORT_TO_INVOICE", postData).subscribe((response: ApiResponse) => {
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
