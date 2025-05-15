import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { OutputFormDto } from '../models/output-form.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityReportService {
  constructor(private http: HttpClient) { }

  getAllOutputForms(): Observable<OutputFormDto[]> {
    return this.http.get<OutputFormDto[]>(`${environment.apiBaseUrl}/OutputForm`);
  }
}