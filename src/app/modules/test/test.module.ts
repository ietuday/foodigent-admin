import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestListComponent } from './test-list/test-list.component';
import { TestRoutingModule } from './test-routing.module';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [
    TestListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TestRoutingModule
  ]
})
export class TestModule { }
