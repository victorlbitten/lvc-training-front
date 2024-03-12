import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CreateDatasetResponse,
  Dataset,
  DatasetFolders,
  DatasetName,
  GetAllDatasetsResponse,
  GetDatasetDetailsResponse,
  Yolov5Category,
  Yolov5Type,
} from '../models/datasets.model';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  private apiUrl = 'http://localhost:8000/datasets'; // Adjust the URL based on your environment

  constructor(private http: HttpClient) {}

  getAllDatasets(): Observable<DatasetName[]> {
    return this.http
      .get<GetAllDatasetsResponse>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  createDataset(datasetName: DatasetName): Observable<DatasetName> {
    return this.http
      .post<CreateDatasetResponse>(this.apiUrl, { name: datasetName })
      .pipe(map((response) => response.data));
  }

  deleteDataset(datasetName: DatasetName): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${datasetName}`);
  }

  getDatasetDetails(datasetName: DatasetName): Observable<DatasetFolders> {
    return this.http
      .get<GetDatasetDetailsResponse>(`${this.apiUrl}/${datasetName}`)
      .pipe(map((response) => response.data.folders));
  }

  uploadDatasetFiles(
    files: FormData,
    category: 'train' | 'valid',
    type: 'images' | 'labels',
    datasetName: DatasetName
  ) {
    return this.http.post(
      `${this.apiUrl}/${datasetName}/${category}/${type}`,
      files
    );
  }
}
