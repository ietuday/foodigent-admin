import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriberDetailsComponent } from './subscriber-details/subscriber-details.component';
import { SubscriberListComponent } from './subscriber-list/subscriber-list.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'subscriber-list',
                component: SubscriberListComponent
            },
            {
                path: 'subscriber-details/:id',
                component: SubscriberDetailsComponent
            },
            {
                path: '',
                redirectTo: 'subscriber-list',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'subscriber-list'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubscriberRoutingModule { }
