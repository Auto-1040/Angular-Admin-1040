import { Component, Inject } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserModel } from '../../models/user.model';
import { MatChipInputEvent, MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatIconModule,
    CommonModule,
    MatAutocompleteModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {
  userForm: FormGroup;
  roles: string[] = [];
  allRoles: string[] = ['User', 'Admin']; 
  roleCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; user: UserModel }
  ) {
    this.roles = data?.user?.roles || [];
    this.userForm = this.fb.group({
      userName: [data?.user?.userName || '', Validators.required],
      email: [data?.user?.email || '', [Validators.required, Validators.email]],
      password: [data?.mode === 'add' ? '' : null, data.mode === 'add' ? Validators.required : null]
    });
    this.roles = data?.user?.roles || [];
  }

  removeRole(role: string): void {
    const index = this.roles.indexOf(role);
    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  }

  addRole(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && this.allRoles.includes(value) && !this.roles.includes(value)) {
      this.roles.push(value);
    }
    event.chipInput!.clear();
    this.roleCtrl.setValue(null);
  }
  
  selected(event: any): void {
    const value = event.option.viewValue;
    if (value && this.allRoles.includes(value) && !this.roles.includes(value)) {
      this.roles.push(value);
    }
    this.roleCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allRoles.filter(role => role.toLowerCase().includes(filterValue));
  }

  save(): void {
    if (this.userForm.valid) {
      const user = { ...this.userForm.value, roles: this.roles };
      if (this.data.mode === 'add') {
        this.userService.addUser(user).subscribe(() => this.dialogRef.close(true));
      } else if (this.data.mode === 'edit') {
        this.userService.updateUser(this.data.user.id, user).subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}