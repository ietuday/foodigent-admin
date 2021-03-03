import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  @ViewChild('drawer') drawer?: MatSidenav;
  isHandset$?: Observable<boolean>
  isHandsetResult?: boolean;
  isSidenavOpen?: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Small])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.isHandset$.subscribe(res => {
      this.isHandsetResult = res;
    });

    this.menuService.getIsSidenavOpenData().subscribe(res => {
      this.isSidenavOpen = res;
      if ((this.drawer) && (this.isHandsetResult === true) && (this.isSidenavOpen === true)) {
        this.drawer?.close();
      }
    });
  }

}
