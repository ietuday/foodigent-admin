import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestListComponent } from './test-list/test-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'test-list',
                component: TestListComponent
            },
            {
                path: '',
                redirectTo: 'test-list',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'test-list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestRoutingModule { }
