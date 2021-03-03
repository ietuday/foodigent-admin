import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { SharedModule } from 'src/app/core/shared.module';
import { RewardRoutingModule } from './reward-routing.module';

@NgModule({
  declarations: [
    OrderListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RewardRoutingModule
  ]
})
export class RewardModule { }
