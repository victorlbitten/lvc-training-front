import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetFolders, DatasetName } from 'src/app/models/datasets.model';
import { DatasetService } from 'src/app/services/dataset.service';

@Component({
  selector: 'app-dataset-details',
  templateUrl: './dataset-details.component.html',
  styleUrls: ['./dataset-details.component.css'],
})
export class DatasetDetailsComponent implements OnInit {
  datasetName: DatasetName;
  datasetFolders: DatasetFolders = {} as DatasetFolders;
  activeTab: 'train' | 'valid' = 'train';
  shownPictures: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datasetService: DatasetService
  ) {}

  ngOnInit() {
    this.datasetName = this.route.snapshot.params['datasetname'];

    // adsf
    this.getDatasetDetails();
  }

  getDatasetDetails() {
    this.datasetService
      .getDatasetDetails(this.datasetName)
      .subscribe((folders) => {
        this.datasetFolders = folders;
        this.setActiveTab(this.activeTab);
      });
  }

  deleteDataset() {
    this.datasetService.deleteDataset(this.datasetName).subscribe(() => {
      this.router.navigate(['/datasets']);
    });
  }

  uploadFiles(event: any): void {
    const category: 'train' | 'valid' = this.activeTab;
    const files: FileList = event.target.files;
    if (files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file: File) => {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        formData.append('files', file, file.webkitRelativePath);
      }
    });

    this.datasetService
      .uploadDatasetFiles(formData, category, 'images', this.datasetName)
      .subscribe((response) => {
        this.getDatasetDetails();
      });
  }

  setActiveTab(tab: 'train' | 'valid') {
    this.activeTab = tab;
    this.setShownPictures();
  }

  setShownPictures() {
    this.shownPictures =
      this.activeTab === 'train'
        ? this.datasetFolders.trainImagesFolder
        : this.datasetFolders.validImagesFolder;
        console.log(this.shownPictures)
  }
}
