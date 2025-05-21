import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ActivityReportService } from '../../services/activity-report.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressBarModule,
    RouterModule,
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalUsers = 0;
  totalForms = 0;
  formsThisYear = 0;
  currentYear = new Date().getFullYear() -1;
  isLoading = true;
  error = false;
  
  // Chart data
  formsByYearData: any[] = [];
  colorScheme = {
    name: 'custom',
    selectable: true,
    group: 'Ordinal',
    domain: ['#3f51b5', '#5c6bc0', '#7986cb', '#9fa8da']
  };
  
  // Activity trend data
  activityTrend: any[] = [];
  
  constructor(
    private userService: UserService,
    private activityReportService: ActivityReportService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Get user count
    this.userService.getAllUsers().pipe(
      catchError(error => {
        console.error('Error loading users:', error);
        this.error = true;
        return of([]);
      })
    ).subscribe(users => {
      this.totalUsers = users.length;
    });

    // Get form data
    this.activityReportService.getAllOutputForms().pipe(
      catchError(error => {
        console.error('Error loading forms:', error);
        this.error = true;
        return of([]);
      })
    ).subscribe(forms => {
      this.totalForms = forms.length;
      this.formsThisYear = forms.filter(form => form.year === this.currentYear).length;
      
      // Process data for charts
      this.processChartData(forms);
      
      this.isLoading = false;
    });
  }
  
  processChartData(forms: any[]): void {
    // Group forms by year for the pie chart
    const yearCounts = forms.reduce((acc, form) => {
      acc[form.year] = (acc[form.year] || 0) + 1;
      return acc;
    }, {});
    
    this.formsByYearData = Object.keys(yearCounts).map(year => ({
      name: `${year}`,
      value: yearCounts[year]
    }));
    
    // Create activity trend data (last 6 months)
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.activityTrend = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[month.getMonth()];
      const monthYear = `${monthName} ${month.getFullYear()}`;
      
      const count = forms.filter(form => {
        const formDate = new Date(form.createdAt);
        return formDate.getMonth() === month.getMonth() && 
               formDate.getFullYear() === month.getFullYear();
      }).length;
      
      this.activityTrend.push({
        name: monthName,
        value: count
      });
    }
  }
}