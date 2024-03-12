import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatInputModule, MatButtonModule, MatListModule, MatCardModule],
  exports: [MatInputModule, MatButtonModule, MatListModule, MatCardModule],
})
export class MaterialModule {}
