import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatInputModule, MatButtonModule, MatListModule],
  exports: [MatInputModule, MatButtonModule, MatListModule],
})
export class MaterialModule {}
