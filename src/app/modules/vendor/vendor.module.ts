import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared.module';
import { VendorRoutingModule } from '../vendor/vendor-routing.module';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';

@NgModule({
  declarations: [
    VendorListComponent,
    VendorDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VendorRoutingModule
  ]
})
export class VendorModule { }
