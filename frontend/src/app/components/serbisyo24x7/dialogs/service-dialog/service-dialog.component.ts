import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ServicesManagementService, Service, ServiceCategory, ServiceProvider } from '../../../../services/services-management.service';

@Component({
  selector: 'app-service-dialog',
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
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.css']
})
export class ServiceDialogComponent implements OnInit {
  service: Service;
  isEditMode = false;
  categories: ServiceCategory[] = [];
  providers: ServiceProvider[] = [];

  private servicesService = inject(ServicesManagementService);

  constructor(
    public dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Service | null
  ) {
    if (data) {
      this.isEditMode = true;
      this.service = { ...data };
    } else {
      this.service = {
        title: '',
        description: '',
        price: 0,
        duration_hours: 1,
        category_id: 0,
        provider_id: 0,
        tags: '',
        status: 'active'
      };
    }
  }

  ngOnInit(): void {
    this.loadCategoriesAndProviders();
  }

  loadCategoriesAndProviders(): void {
    this.servicesService.getCategories().subscribe({
      next: (data: ServiceCategory[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });

    this.servicesService.getProviders().subscribe({
      next: (data: ServiceProvider[]) => {
        this.providers = data;
      },
      error: (error: any) => {
        console.error('Error loading providers:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.service.title.trim() && this.service.category_id > 0 && this.service.provider_id > 0) {
      this.dialogRef.close(this.service);
    }
  }
}
