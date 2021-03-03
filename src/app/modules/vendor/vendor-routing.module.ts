import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'vendor-list',
                component: VendorListComponent
            },
            {
                path: 'vendor-details/:id',
                component: VendorDetailsComponent
            },
            {
                path: '',
                redirectTo: 'vendor-list',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'vendor-list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VendorRoutingModule { }
