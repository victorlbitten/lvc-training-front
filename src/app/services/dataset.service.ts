import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatasetService {
  private apiUrl = 'http://localhost:8000/datasets'; // Adjust the URL based on your environment

  constructor(private http: HttpClient) {}
}
