import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetDetailsComponent } from './components/dataset-details/dataset-details.component';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { PictureAnnotatorComponent } from './components/picture-annotator/picture-annotator.component';

const routes: Routes = [
  { path: '', redirectTo: 'datasets', pathMatch: 'full' },
  { path: 'datasets', component: DatasetListComponent },
  { path: 'datasets/:datasetname', component: DatasetDetailsComponent },
  {
    path: 'datasets/:datasetname/annotate',
    component: PictureAnnotatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
