import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditMerchandiseComponent } from './add-edit-merchandise/add-edit-merchandise.component';
import { MerchandiseDetailsComponent } from './merchandise-details/merchandise-details.component';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'merchandise-list',
                component: MerchandiseListComponent
            },
            {
                path: 'merchandise-details/:id',
                component: MerchandiseDetailsComponent
            },
            {
                path: 'add-merchandise',
                component: AddEditMerchandiseComponent
            },
            {
                path: 'edit-merchandise/:id',
                component: AddEditMerchandiseComponent
            },
            {
                path: '',
                redirectTo: 'merchandise-list',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'merchandise-list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GrabitRoutingModule { }
