import { AfterViewChecked, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authentication/auth/auth.service';
import { MenuService } from '../../services/menu/menu.service';
import { ToastService } from '../../services/toast/toast.service';
import { Menu } from '../menu/menu.model';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent implements OnInit, AfterViewChecked {
  userImage = 'assets/imgages/users/default-user.jpg';
  userName?: string;
  userType?: string;
  isAdmin?: string;
  menuItems?: Array<Menu>;

  constructor(
    public menuService: MenuService,
    public authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.menuService.dynamicMenus.subscribe(res => {
      this.menuItems = res;
    });
  }

  ngAfterViewChecked() {
    // if (this.authService.isLoggedIn()) {
    //   this.authService.loggedInUser().subscribe((result) => {
    //     if (result['isSuccess']) {
    //       setTimeout(() => {
    //         this.userImage = result.data['profileUrl'];
    //         this.userName = `${result.data['firstName']} ${result.data['lastName']}`;
    //         this.userType = result.data['type'];
    //         this.isAdmin = result.data['isAdmin']
    //       }, 0);
    //     } else {
    //       this.authService.logout().subscribe((resp) => resp);
    //     }
    //   });
    // }
  }

  /**
 * @function closeSubMenus
 * @description closing other sub menus
 */
  public closeSubMenus() {
    const menu = document.getElementById('vertical-menu');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        const child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

}
