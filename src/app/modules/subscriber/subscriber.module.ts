import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared.module';
import { SubscriberRoutingModule } from './subscriber-routing.module';
import { SubscriberListComponent } from './subscriber-list/subscriber-list.component';
import { SubscriberDetailsComponent } from './subscriber-details/subscriber-details.component';

@NgModule({
  declarations: [
    SubscriberListComponent,
    SubscriberDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubscriberRoutingModule
  ]
})
export class SubscriberModule { }
