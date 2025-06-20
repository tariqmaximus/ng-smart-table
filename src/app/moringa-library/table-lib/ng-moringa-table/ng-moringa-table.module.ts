import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMoringaTableComponent } from './ng-moringa-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgMoringaTableComponent // ✅ IMPORT instead of DECLARE
  ],
  exports: [NgMoringaTableComponent]
})
export class NgMoringaTableModule {}
