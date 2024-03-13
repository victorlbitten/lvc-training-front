import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatasetFolders, DatasetName } from 'src/app/models/datasets.model';
import { YoloFolderDataService } from 'src/app/services/yolo-folder-data.service';

@Component({
  selector: 'app-picture-annotator',
  templateUrl: './picture-annotator.component.html',
  styleUrls: ['./picture-annotator.component.css'],
})
export class PictureAnnotatorComponent implements OnInit {
  datasetName: DatasetName;
  datasetFolders: DatasetFolders;

  constructor(
    private datasetFoldersService: YoloFolderDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getRouteParams();
    this.getDatasetFolders();
  }

  getRouteParams() {
    this.datasetName = this.route.snapshot.params['datasetname'];
  }

  getDatasetFolders() {
    this.datasetFoldersService
      .getDatasetFolders(this.datasetName)
      .subscribe((folders) => {
        this.datasetFolders = folders;
        console.log(this.datasetFolders);
      });
  }
}
