import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatasetFolders } from '../models/datasets.model';

@Injectable({
  providedIn: 'root',
})
export class YoloFolderDataService {
  private datasetFolders = new BehaviorSubject<DatasetFolders>(
    {} as DatasetFolders
  );

  setDatasetFolders(data: DatasetFolders) {
    this.datasetFolders.next(data);
  }

  getDatasetFolders() {
    return this.datasetFolders.asObservable();
  }

  constructor() {}
}
