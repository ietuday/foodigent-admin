import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchandiseListComponent } from './merchandise-list/merchandise-list.component';
import { MerchandiseDetailsComponent } from './merchandise-details/merchandise-details.component';
import { SharedModule } from 'src/app/core/shared.module';
import { GrabitRoutingModule } from './grabit-routing.module';
import { AddEditMerchandiseComponent } from './add-edit-merchandise/add-edit-merchandise.component';

@NgModule({
  declarations: [
    MerchandiseListComponent,
    MerchandiseDetailsComponent,
    AddEditMerchandiseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GrabitRoutingModule
  ]
})
export class GrabitModule { }
