import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { AuthService } from '../app/core/services/authentication/auth/auth.service';
import { LoadingService } from './core/services/loading/loading.service';
import { PwaUpdateService } from './core/services/pwa-update/pwa-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'iGrab Admin';
  isLoading = false;
  isNavigationStarted = false;

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    // private onlineService: OnlineService,
    private authService: AuthService,
    private pwaUpdateService: PwaUpdateService
  ) { }

  ngOnInit(): void {
    // if (this.authService.isLoggedIn()) {
    //   this.onlineService.setOnline();
    // }

    this.loadingService.loadingState.subscribe(res => {
      this.isLoading = res.active;
    });

    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (!this.isNavigationStarted) {
          this.loadingService.show();
          this.isNavigationStarted = true;
        }
      } else if (e instanceof NavigationEnd) {
        if (this.isNavigationStarted) {
          this.loadingService.hide();
          this.isNavigationStarted = false;
        }
      } else if (e instanceof NavigationCancel) {
        if (this.isNavigationStarted) {
          this.loadingService.hide();
          this.isNavigationStarted = false;
        }
      }
    });

    // for activate update
    this.pwaUpdateService.activateUpdate();
  }

}
