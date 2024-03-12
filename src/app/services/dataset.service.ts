import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DatasetName, GetAllDatasetsResponse } from '../models/datasets.model';

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
}