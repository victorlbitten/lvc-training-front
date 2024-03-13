import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { DatasetFolders, DatasetName } from '../models/datasets.model';
import { DatasetService } from './dataset.service';

@Injectable({
  providedIn: 'root',
})
export class YoloFolderDataService {
  private currentDatasetName: DatasetName | null = null;
  private datasetFolders = new BehaviorSubject<DatasetFolders>(
    {} as DatasetFolders
  );

  constructor(private datasetService: DatasetService) {}

  setDatasetFolders(data: DatasetFolders, datasetName: DatasetName) {
    this.currentDatasetName = datasetName;
    this.datasetFolders.next(data);
  }

  getDatasetFolders(datasetName: DatasetName) {
    if (this.currentDatasetName !== datasetName || !this.datasetFolders.value) {
      return this.datasetService.getDatasetDetails(datasetName).pipe(
        tap((folders) => {
          this.setDatasetFolders(folders, datasetName);
        })
      );
    }
    return this.datasetFolders.asObservable();
  }
}
