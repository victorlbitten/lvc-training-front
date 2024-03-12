import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'datasets', pathMatch: 'full' },
  { path: 'datasets', component: DatasetListComponent },
  { path: 'datasets/:datasetname', component: DatasetDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
