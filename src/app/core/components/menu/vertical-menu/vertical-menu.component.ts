import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppStorageService } from 'src/app/core/services/authentication/app-storage/app-storage.service';
import { MenuService } from 'src/app/core/services/menu/menu.service';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { Menu } from '../menu.model';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerticalMenuComponent implements OnInit {
  @Input('menuItems') menuItems?: Array<Menu>;
  @Input('menuParentId') menuParentId?: any;
  parentMenu?: Array<any>;

  constructor(
    private menuService: MenuService,
    private appStorageService: AppStorageService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    if (this.menuItems) {
      this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
    }
  }

  /**
   * @description action on menu click
   * @param- menu
   */
  onClick(menu: any) {
    if (this.menuItems) {
      this.menuService.toggleMenuItem(menu.id);
      this.menuService.closeOtherSubMenus(this.menuItems, menu.id);
    }
  }

  /**
   * @description action on main menu click
   * @param- menu
   */
  onMainMenuClick(menu: any) {
    if (this.menuItems) {
      this.menuService.setIsSidenavOpenData(true);
      this.menuService.toggleMenuItem(menu.id);
      this.menuService.closeOtherSubMenus(this.menuItems, menu.id);
    }
  }

  /**
   * @description Navigate to given menu 
   * @param- menu 
   */
  navigateTo(menu: any) {
    menu.routerLink
      ?
      this.router.navigate([menu.routerLink])
      :
      this.toastService.activateError(`${menu.title} page is in under construction mode. stay tunned for updates.`);
  }

}
