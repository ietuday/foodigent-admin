import { Injectable, Optional, SkipSelf } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    @Optional() @SkipSelf() prior: AuthGuard,
    private authService: AuthService,
    private router: Router) {
    if (prior) {
      return prior;
    }
  }

  /**
   * @description canActivate
   * @param next next
   * @param state state
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      if (next.data['name'] && next.data['name'] === 'auth') {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    } else {
      if (next.data['name'] && next.data['name'] === 'auth') {
        return true;
      }
      // show notification if needed
      this.router.navigate(['/auth']);
      return false;
    }
  }

  /**
   * @description canActivateChild
   * @param next next
   * @param state state
   */
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(next, state);
  }

}
