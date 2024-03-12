import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../../services/dataset.service';
import { Observable, map } from 'rxjs';
import { DatasetName } from 'src/app/models/datasets.model';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css'],
})
export class DatasetListComponent implements OnInit {
  constructor(private datasetService: DatasetService) {}
  datasetsNames$: Observable<string[]>;

  // Creation
  newDatasetName: DatasetName = '';
  showCreateForm = false;

  ngOnInit(): void {
    this.datasetsNames$ = this.datasetService.getAllDatasets();
  }

  onCreateDataset() {
    this.datasetService
      .createDataset(this.newDatasetName)
      .subscribe((response) => {
        this.datasetsNames$ = this.datasetService.getAllDatasets();
        this.showCreateForm = false;
      });
  }

  deleteDataset(datasetName: DatasetName) {
    this.datasetService.deleteDataset(datasetName).subscribe(() => {
      this.datasetsNames$ = this.datasetService.getAllDatasets();
    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }
}
