import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/core/dialog/confirmation-dialog/confirmation-dialog.component';
import { MerchandiseModel } from 'src/app/core/models/merchandise.model';
import { ApiParam, ApiResponse, ApiService } from 'src/app/core/services/api/api.service';
import { AppStorageService } from 'src/app/core/services/authentication/app-storage/app-storage.service';
import { AuthService } from 'src/app/core/services/authentication/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { SearchService } from 'src/app/core/services/search/search.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';

@Component({
  selector: 'app-merchandise-list',
  templateUrl: './merchandise-list.component.html',
  styleUrls: ['./merchandise-list.component.scss']
})
export class MerchandiseListComponent implements OnInit, AfterViewInit {
  merchandiseDisplayedColumns: string[] = ['profile', 'name', "desc", "isSuspended", "action"];
  merchandisePageIndex: number = 0;
  merchandisePageSize: number = 10;
  merchandiseCollectionSize: number = 0;
  merchandise = new MatTableDataSource<MerchandiseModel>();
  @ViewChild('merchandisePaginator') merchandisePaginator?: MatPaginator;
  @ViewChild('merchandiseSort') merchandiseSort?: MatSort;

  placeholder: string = "Search by merchandise name";
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
  merchandiseSelectedFilter?: any;

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
    this.titleService.setTitle('Foodigent Admin | Merchandise');
    this.getSelectedFilterData();
    this.searchService.getMerchandiseSearchData().pipe(debounceTime(1000), distinctUntilChanged()).subscribe((res: any) => {
      console.log("11111 ngOnInit() searchQuery===========", res);
      if (res !== "") {
        this.getMerchandise();
      }
    });
    this.getMerchandise();
  }

  ngAfterViewInit() {
    if (this.merchandiseSort && this.merchandisePaginator) {
      this.merchandise.sort = this.merchandiseSort;
      this.merchandise.paginator = this.merchandisePaginator;
    }
  }

  /**
   * @description get merchandise list data
   */
  getMerchandise() {
    let filterData = {
      pageNo: this.merchandisePageIndex + 1,
      limit: this.merchandisePageSize,
      sortItem: this.sortItem,
      sortOrder: this.sortOrder,
      searchQuery: this.searchQuery,
      selectedFilter: this.merchandiseSelectedFilter
    };
    let postData: ApiParam = {
      data: filterData
    };
    this.loadingService.show();
    this.apiService.request("GET_ALL_COMPANY", postData).subscribe((response: ApiResponse) => {
      if (response.isSuccess) {
        this.merchandise.data = response.data.companies;
        this.merchandiseCollectionSize = response.data.totalCount;
        this.loadingService.hide();
      }
    },
      error => {
        this.loadingService.hide();
      });
  }

  /**
   * @description get filtered merchandise list data
   * @param event 
   */
  getNewMerchandise(event: any) {
    this.merchandisePageIndex = event.pageIndex;
    this.merchandisePageSize = event.pageSize;
    this.getMerchandise();
  }

  /**
   * @description event on sort change
   * @param event 
   */
  sortChange(event: any) {
    console.log("sort event::::::::::::::", event);
    this.sortItem = event.active;
    this.sortOrder = event.direction;
    (this.merchandisePaginator as MatPaginator).pageIndex = 0;
    this.merchandisePageIndex = 0;
    this.searchQuery = "";
    this.setMerchandiseSearchData();
    this.getMerchandise();
  }

  /**
   * @description get Merchandise list data
   */
  onSearchEvent(value: any) {
    this.searchQuery = value;
    (this.merchandisePaginator as MatPaginator).pageIndex = 0;
    this.merchandisePageIndex = 0;
    this.setMerchandiseSearchData();
  }

  /**
   * @description push data into subject
   */
  setMerchandiseSearchData() {
    const query = this.searchQuery.trim();
    this.searchService.setMerchandiseSearchData(query);
  }

  /**
   * @description export to excel
   */
  exportToExcel() {
    let postData: ApiParam = {
      data: {
        merchandiseId: '123',
        sortItem: this.sortItem,
        sortOrder: this.sortOrder,
        searchQuery: this.searchQuery,
        selectedFilter: this.merchandiseSelectedFilter
      }
    }
    this.loadingService.show();
    this.apiService.request("MERCHANDISE_EXPORT_TO_EXCEL", postData).subscribe((response: ApiResponse) => {
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
    this.apiService.request("MERCHANDISE_EXPORT_TO_INVOICE", postData).subscribe((response: ApiResponse) => {
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
      this.appStorageService.save('merchandise-list-selected-filter', value);
      this.getSelectedFilterData();
      (this.merchandisePaginator as MatPaginator).pageIndex = 0;
      this.merchandisePageIndex = 0;
      this.searchQuery = "";
      this.setMerchandiseSearchData();
      this.getMerchandise();
    }
  }

  /**
   * @description get selected filtered data
   */
  getSelectedFilterData() {
    if (this.appStorageService.get('merchandise-list-selected-filter') !== null) {
      this.merchandiseSelectedFilter = this.appStorageService.get('merchandise-list-selected-filter');
    } else {
      this.appStorageService.save('merchandise-list-selected-filter', "active");
      this.merchandiseSelectedFilter = "active";
    }
    console.log("merchandise-list-selected-filter===========", this.merchandiseSelectedFilter);
  }

  /**
   * @description To activate and deactivate merchandise account
   * @param id 
   * @param isActive 
   * @param isActive 
   */
  activateDeactivateMerchandise(id: string, isActive: boolean = true, name: string): void {
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
        this.apiService.request('DEACTIVATE_MERCHANDISE', param).subscribe((response: ApiResponse) => {
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
   * @description navigating to merchandise details page
   */
  goToDetailsPage(id: any) {
    this.router.navigate([`/grabits/merchandise-details/${id}`]);
  }

  /**
   * @description navigating to add merchendise page
   */
  goToAddMerchandisePage() {
    this.router.navigate([`/grabits/add-merchandise`]);
  }

  /**
   * @description navigating to edit merchendise page
   */
  goToEditMerchandisePage(id: any) {
    this.router.navigate([`/grabits/edit-merchandise/${id}`]);
  }

}
