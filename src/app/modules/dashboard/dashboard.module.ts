import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ChangePasswordComponent } from 'src/app/core/pages/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SidenavComponent } from 'src/app/core/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from 'src/app/core/components/menu/vertical-menu/vertical-menu.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    UserMenuComponent,
    ChangePasswordComponent,
    ProfileComponent,
    SidenavComponent,
    VerticalMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
