import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { Menu } from '../../components/menu/menu.model';
import { verticalMenuItems } from '../../components/menu/menu';
import { AppStorageService } from '../authentication/app-storage/app-storage.service';
import { AuthService } from '../authentication/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  dynamicMenus = new BehaviorSubject<Menu[]>([]);
  isSidenavOpen = new BehaviorSubject<boolean>(false);
  privacy: any;

  constructor(
    private location: Location,
    private authService: AuthService,
    private appStorage: AppStorageService
  ) {
    this.privacy = this.appStorage.get('userType');

    console.log("this.privacy===============", this.privacy);

    this.privacy
      ? this.setVerticalMenuItems(this.privacy)
      : this.dynamicMenus.next(verticalMenuItems);
  }

  /**
   *  @description pushing menu items to be displayed as per user
   *  @param- privacy
   */
  public setVerticalMenuItems(privacy: string) {
    switch (privacy) {
      // case 'public':
      //   this.dynamicMenus.next(
      //     verticalMenuItems.map(item => {
      //       if (item.privacy === 'private' || item.privacy === 'expert' || item.privacy === 'admin' || item.privacy === 'moderator') {
      //         item.show = false;
      //         return item;
      //       } else {
      //         item.show = true;
      //         return item;
      //       }
      //     })
      //   );
      //   break;

      // case 'Registered User':
      //   this.dynamicMenus.next(
      //     verticalMenuItems.map(item => {
      //       if (item.privacy === 'public' || item.privacy === 'private') {
      //         item.show = this.authService.isLoggedIn();
      //         return item;
      //       } else {
      //         item.show = false;
      //         return item;
      //       }
      //     })
      //   );
      //   break;

      // case 'Lawyer': case 'Financial agent': case 'Migration agent': case 'Government': case 'Education provider':
      //   this.dynamicMenus.next(
      //     verticalMenuItems.map(item => {
      //       if (item.privacy === 'public' || item.privacy === 'private' || item.privacy === 'expert') {
      //         item.show = this.authService.isLoggedIn();
      //         this.authService.loggedInUser().subscribe((result) => {

      //           if (item.forum) {
      //             if (result.data.forums.includes(item.forum)) {
      //               item.show = true;
      //             } else {
      //               item.show = false;
      //             }
      //           }
      //         });
      //         return item;
      //       } else {
      //         item.show = !this.authService.isLoggedIn();
      //         return item;
      //       }
      //     })
      //   );
      //   break;

      // case 'Moderator':
      //   this.dynamicMenus.next(
      //     verticalMenuItems.map(item => {
      //       if (item.privacy === 'moderator' || item.privacy === 'public' || item.privacy === 'private' || item.privacy === 'expert') {
      //         item.show = this.authService.isLoggedIn();
      //         return item;
      //       } else {
      //         item.show = false;
      //         return item;
      //       }
      //     })
      //   );
      //   break;

      case 'Admin':
        this.dynamicMenus.next(
          verticalMenuItems.map(item => {
            if (item.privacy === 'admin' || item.privacy === 'moderator' || item.privacy === 'public' || item.privacy === 'private' || item.privacy === 'expert') {
              item.show = this.authService.isLoggedIn();
              return item;
            } else {
              item.show = false;
              return item;
            }
          })
        );
        break;

      // case 'all':
      //   this.dynamicMenus.next(
      //     verticalMenuItems.map(item => {
      //       if (item.privacy === 'public' || item.privacy === 'private' || item.privacy === 'expert') {
      //         item.show = true;
      //         return item;
      //       } else {
      //         item.show = false;
      //         return item;
      //       }
      //     })
      //   );
      //   break;
    }
  }

  /**
   * @description to expanding currently active menu
   * @param- menu
   */
  public expandActiveSubMenu(menu: Array<Menu>) {
    const url = this.location.path();
    const routerLink = url; // url.substring(1, url.length);
    const activeMenuItem = menu.filter(item => item.routerLink === routerLink);
    if (activeMenuItem[0]) {
      let menuItem = activeMenuItem[0];
      while (menuItem.parentId !== 0) {
        const parentMenuItem = menu.filter(
          item => item.id === menuItem.parentId
        )[0];
        menuItem = parentMenuItem;
        this.toggleMenuItem(menuItem.id);
      }
    }
  }

  /**
   * @description toggle menus
   * @param- menuId
   */
  public toggleMenuItem(menuId: any) {
    const menuItem = document.getElementById('menu-item-' + menuId);
    const subMenu = document.getElementById('sub-menu-' + menuId);
    if (subMenu && menuItem) {
      if (subMenu.classList.contains('show')) {
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      } else {
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }
    }
  }

  /**
   * @description closing other sub menus
   * @param- menu
   * @param- menuId
   */
  public closeOtherSubMenus(menu: Array<Menu>, menuId: any) {
    const currentMenuItem = menu.filter(item => item.id === menuId)[0];
    if (currentMenuItem.parentId === 0 && !currentMenuItem.target) {
      menu.forEach(item => {
        if (item.id !== menuId) {
          const subMenu = document.getElementById('sub-menu-' + item.id);
          const menuItem = document.getElementById('menu-item-' + item.id);
          if (subMenu && menuItem) {
            if (subMenu.classList.contains('show')) {
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }
          }
        }
      });
    }
  }

  /**
   * @description Close all sub menus. 
   */
  public closeAllSubMenus() {
    const menu = document.getElementById('vertical-menu');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        const child = menu.children[0].children[i];
        if (child && child.children.length > 0) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  /**
   * @description set value to isSidenavOpen subject
   * @param data 
   */
  setIsSidenavOpenData(data: boolean) {
    this.isSidenavOpen.next(data);
  }

  /**
   * @description get value from isSidenavOpen subject
   */
  getIsSidenavOpenData() {
    return this.isSidenavOpen;
  }

}
