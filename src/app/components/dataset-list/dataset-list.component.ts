import { Component, OnInit } from '@angular/core';
import { DatasetService } from '../../services/dataset.service';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css'],
})
export class DatasetListComponent implements OnInit {
  constructor(private datasetService: DatasetService) {}

  ngOnInit(): void {}
}
