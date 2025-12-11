import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementService, User } from '../../../services/user-management.service';

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.css']
})
export class UserEditDialogComponent {
  private userService = inject(UserManagementService);
  private dialogRef = inject(MatDialogRef<UserEditDialogComponent>);

  user: User;
  formData: Partial<User> = {};
  isLoading = false;
  errorMessage = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User }) {
    this.user = data.user;
    this.formData = {
      username: this.user.username,
      email: this.user.email,
      full_name: this.user.full_name,
      status: this.user.status
    };
  }

  onSubmit() {
    if (!this.formData.email || !this.formData.full_name) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.updateUser(this.user.id, this.formData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.dialogRef.close(updatedUser);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Failed to update user';
        console.error('Error updating user:', err);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
