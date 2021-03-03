import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material/material.module';
import { HammerConfig } from './config/hammer.config';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { PipesModule } from './pipes/pipes.module';
import { DirectivesModule } from './directives/directives.module';
import { CommonWarningComponent } from './dialog/common-warning/common-warning.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { SearchComponent } from './components/search/search.component';
import { SelectComponent } from './components/select/select.component';

@NgModule({
  declarations: [
    CustomToastComponent,
    ConfirmationDialogComponent,
    CommonWarningComponent,
    DateRangePickerComponent,
    SearchComponent,
    SelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    PipesModule,
    DirectivesModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    PipesModule,
    DirectivesModule,

    CustomToastComponent,
    ConfirmationDialogComponent,
    SearchComponent,
    DateRangePickerComponent,
    SelectComponent
  ]
})
export class SharedModule { }