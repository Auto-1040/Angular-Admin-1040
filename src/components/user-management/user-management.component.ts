import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserModel } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users = new MatTableDataSource<UserModel>();
  displayedColumns: string[] = ['id', 'name', 'email', 'roles', 'actions'];
  isLoading = true;
  searchText = '';
  selectedRole: string | null = null;
  availableRoles: string[] = ['Admin', 'User'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.users.sort = this.sort;
    this.users.paginator = this.paginator;
    
    // Custom filter predicate to search across multiple fields
    this.users.filterPredicate = (data: UserModel, filter: string) => {
      const searchStr = (data.id?.toString() || '') + 
                        (data.userName?.toLowerCase() || '') + 
                        (data.email?.toLowerCase() || '');
      
      const roleFilter = this.selectedRole ? 
        data.roles.includes(this.selectedRole) : true;
        
      return searchStr.indexOf(filter.toLowerCase()) !== -1 && roleFilter;
    };
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      panelClass: 'user-dialog',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: UserModel): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      panelClass: 'user-dialog',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number, userName: string): void {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  applyFilter(): void {
    this.users.filter = this.searchText.trim().toLowerCase();
    
    if (this.users.paginator) {
      this.users.paginator.firstPage();
    }
  }

  filterByRole(role: string | null): void {
    this.selectedRole = role;
    this.applyFilter();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedRole = null;
    this.users.filter = '';
    
    if (this.users.paginator) {
      this.users.paginator.firstPage();
    }
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'primary';
      case 'user':
        return 'accent';
      default:
        return '';
    }
  }
}