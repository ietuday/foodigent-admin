import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { ChangePasswordComponent } from 'src/app/core/pages/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardHomeComponent,
        children: [
            {
                path: 'change-password',
                component: ChangePasswordComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'vendors',
                loadChildren: () => import('../vendor/vendor.module').then(res => res.VendorModule)
            },
            {
                path: 'grabits',
                loadChildren: () => import('../grabit/grabit.module').then(res => res.GrabitModule)
            },
            {
                path: 'rewards',
                loadChildren: () => import('../reward/reward.module').then(res => res.RewardModule)
            },
            {
                path: 'customers',
                loadChildren: () => import('../customer/customer.module').then(res => res.CustomerModule)
            },
            {
                path: 'orders',
                loadChildren: () => import('../order/order.module').then(res => res.OrderModule)
            },
            {
                path: 'test',
                loadChildren: () => import('../test/test.module').then(res => res.TestModule)
            },
            {
                path: '',
                redirectTo: 'vendors',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
