import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'customer-list',
                component: CustomerListComponent
            },
            {
                path: 'customer-details/:id',
                component: CustomerDetailsComponent
            },
            {
                path: '',
                redirectTo: 'customer-list',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'customer-list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }
