import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { authGuard } from '../guards/auth.guard';
import { ActivityReportComponent } from '../components/activity-report/activity-report.component';
import { UserManagementComponent } from '../components/user-management/user-management.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UserManagementComponent, canActivate: [authGuard] },
    { path: 'activity', component: ActivityReportComponent, canActivate: [authGuard] }
];
