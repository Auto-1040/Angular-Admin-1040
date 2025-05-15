import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivityReportService } from '../../services/activity-report.service';
import { OutputFormDto } from '../../models/output-form.model';

@Component({
  selector: 'app-activity-report',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './activity-report.component.html',
  styleUrl: './activity-report.component.css',
  providers: [DatePipe]
})
export class ActivityReportComponent implements OnInit {
  displayedColumns: string[] = ['id', 'userId', 'year', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<OutputFormDto>();
  isLoading = true;
  error = false;
  years: number[] = [];
  selectedYear: number | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private activityReportService: ActivityReportService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadActivityData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadActivityData(): void {
    this.isLoading = true;
    this.error = false;
    
    this.activityReportService.getAllOutputForms().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.extractYears(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading activity data:', error);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  extractYears(data: OutputFormDto[]): void {
    const uniqueYears = new Set<number>();
    data.forEach(form => uniqueYears.add(form.year));
    this.years = Array.from(uniqueYears).sort((a, b) => b - a); // Sort descending
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByYear(year: number | null): void {
    this.selectedYear = year;
    
    if (year === null) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: OutputFormDto, filter: string) => {
        return data.year === parseInt(filter);
      };
      this.dataSource.filter = year.toString();
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.selectedYear = null;
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewForm(s3Url: string): void {
    window.open(s3Url, '_blank');
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'MMM d, y, h:mm a') || '';
  }
}