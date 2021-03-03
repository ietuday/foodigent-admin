import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertToUnitPipe } from './convert-to-unit/convert-to-unit.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';

@NgModule({
  declarations: [
    ConvertToUnitPipe,
    TruncatePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConvertToUnitPipe,
    TruncatePipe
  ]
})
export class PipesModule { }
