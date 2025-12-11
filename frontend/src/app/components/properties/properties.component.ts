import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PropertyService, Property, Tenant, MaintenanceRequest, PropertyStats } from '../../services/property.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatDialogModule
  ],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  private propertyService = inject(PropertyService);
  private dialog = inject(MatDialog);

  properties: Property[] = [];
  tenants: Tenant[] = [];
  maintenanceRequests: MaintenanceRequest[] = [];
  stats: PropertyStats | null = null;
  isLoading = true;

  displayedColumnsProperties = ['title', 'address', 'property_type', 'status', 'price', 'actions'];
  displayedColumnsTenants = ['full_name', 'email', 'property_title', 'status', 'lease_end', 'actions'];
  displayedColumnsMaintenance = ['title', 'property_title', 'priority', 'status', 'requested_date', 'actions'];

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.isLoading = true;
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.loadStats();
      },
      error: (err) => {
        console.error('Error loading properties:', err);
        this.isLoading = false;
      }
    });

    this.propertyService.getTenants().subscribe({
      next: (data) => {
        this.tenants = data;
      },
      error: (err) => console.error('Error loading tenants:', err)
    });

    this.propertyService.getMaintenanceRequests().subscribe({
      next: (data) => {
        this.maintenanceRequests = data;
      },
      error: (err) => console.error('Error loading maintenance requests:', err)
    });
  }

  loadStats() {
    this.propertyService.getPropertyStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available':
        return 'success';
      case 'rented':
        return 'accent';
      case 'sold':
        return 'primary';
      case 'maintenance':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'warn';
      case 'high':
        return 'primary';
      case 'medium':
        return 'accent';
      case 'low':
        return 'success';
      default:
        return 'primary';
    }
  }

  editProperty(property: Property) {
    console.log('Edit property:', property);
  }

  deleteProperty(property: Property) {
    if (confirm(`Are you sure you want to delete ${property.title}?`)) {
      this.propertyService.deleteProperty(property.id).subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (err) => console.error('Error deleting property:', err)
      });
    }
  }

  editTenant(tenant: Tenant) {
    console.log('Edit tenant:', tenant);
  }

  deleteTenant(tenant: Tenant) {
    if (confirm(`Are you sure you want to delete ${tenant.full_name}?`)) {
      this.propertyService.deleteTenant(tenant.id).subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (err) => console.error('Error deleting tenant:', err)
      });
    }
  }

  editMaintenance(request: MaintenanceRequest) {
    console.log('Edit maintenance:', request);
  }

  deleteMaintenance(request: MaintenanceRequest) {
    if (confirm(`Are you sure you want to delete this maintenance request?`)) {
      this.propertyService.deleteMaintenanceRequest(request.id).subscribe({
        next: () => {
          this.loadAllData();
        },
        error: (err) => console.error('Error deleting maintenance request:', err)
      });
    }
  }
}
