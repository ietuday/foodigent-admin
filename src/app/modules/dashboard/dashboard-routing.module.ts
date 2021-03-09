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
                path: 'subscribers',
                loadChildren: () => import('../subscriber/subscriber.module').then(res => res.SubscriberModule)
            },
            {
                path: 'test',
                loadChildren: () => import('../test/test.module').then(res => res.TestModule)
            },
            {
                path: '',
                redirectTo: 'subscribers',
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
