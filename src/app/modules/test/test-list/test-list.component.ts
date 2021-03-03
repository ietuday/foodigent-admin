import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
  users?: Array<any>;
  url = 'https://gorest.co.in/public-api/users';
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.loadingService.show();
    this.http.get(this.url).subscribe((result: any) => {
      if (result) {
        this.users = result.data;
      }
      this.loadingService.hide();
    },
      (error) => {
        this.loadingService.hide();
      });
  }

}
