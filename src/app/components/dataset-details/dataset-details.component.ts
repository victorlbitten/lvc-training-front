import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetName } from 'src/app/models/datasets.model';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css'],
})
export class DatasetDetailsComponent implements OnInit {
  datasetName: DatasetName;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datasetService: DatasetService
  ) {}

  ngOnInit() {
    this.datasetName = this.route.snapshot.params['datasetname'];
  }

  deleteDataset() {
    this.datasetService.deleteDataset(this.datasetName).subscribe(() => {
      this.router.navigate(['/datasets']);
    });
  }
}
