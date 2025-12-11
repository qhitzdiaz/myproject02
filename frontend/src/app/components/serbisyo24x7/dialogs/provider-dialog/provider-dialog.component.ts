import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ServicesManagementService, ServiceProvider, ServiceCategory } from '../../../../services/services-management.service';

@Component({
  selector: 'app-provider-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './provider-dialog.component.html',
  styleUrls: ['./provider-dialog.component.css']
})
export class ProviderDialogComponent implements OnInit {
  provider: ServiceProvider;
  isEditMode = false;
  categories: ServiceCategory[] = [];

  private servicesService = inject(ServicesManagementService);

  constructor(
    public dialogRef: MatDialogRef<ProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceProvider | null
  ) {
    if (data) {
      this.isEditMode = true;
      this.provider = { ...data };
    } else {
      this.provider = {
        name: '',
        email: '',
        phone: '',
        category_id: 0,
        rating: 5.0,
        availability: 'available',
        experience_years: 1,
        status: 'active'
      };
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.servicesService.getCategories().subscribe({
      next: (data: ServiceCategory[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.provider.name.trim() && this.provider.category_id > 0) {
      this.dialogRef.close(this.provider);
    }
  }
}
