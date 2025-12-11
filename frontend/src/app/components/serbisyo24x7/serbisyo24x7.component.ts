import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ServicesManagementService, ServiceCategory, ServiceProvider, Service, ServiceBooking } from '../../services/services-management.service';
import { CategoryDialogComponent } from './dialogs/category-dialog/category-dialog.component';
import { ProviderDialogComponent } from './dialogs/provider-dialog/provider-dialog.component';
import { ServiceDialogComponent } from './dialogs/service-dialog/service-dialog.component';
import { BookingDialogComponent } from './dialogs/booking-dialog/booking-dialog.component';
import { NotificationCenterComponent } from '../notification-center/notification-center.component';

@Component({
  selector: 'app-serbisyo24x7',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NotificationCenterComponent
  ],
  templateUrl: './serbisyo24x7.component.html',
  styleUrls: ['./serbisyo24x7.component.css']
})
export class Serbisyo24x7Component implements OnInit {
  private servicesService = inject(ServicesManagementService);
  private dialog = inject(MatDialog);

  // Categories
  categories: ServiceCategory[] = [];
  categoriesLoading = true;
  categoriesColumns = ['name', 'description', 'status', 'actions'];

  // Providers
  providers: ServiceProvider[] = [];
  providersLoading = true;
  providersColumns = ['name', 'email', 'phone', 'category_name', 'rating', 'availability', 'status', 'actions'];

  // Services
  services: Service[] = [];
  servicesLoading = true;
  servicesColumns = ['title', 'provider_name', 'category_name', 'price', 'duration_hours', 'status', 'actions'];

  // Bookings
  bookings: ServiceBooking[] = [];
  bookingsLoading = true;
  bookingsColumns = ['booking_code', 'service_title', 'customer_name', 'booking_date', 'status', 'payment_status', 'actions'];

  ngOnInit() {
    this.loadCategories();
    this.loadProviders();
    this.loadServices();
    this.loadBookings();
  }

  // Category methods
  loadCategories() {
    this.categoriesLoading = true;
    this.servicesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.categoriesLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categoriesLoading = false;
      }
    });
  }

  openCategoryDialog(category?: ServiceCategory) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '450px',
      data: category ? { ...category } : null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.servicesService.updateCategory(result.id, result).subscribe({
            next: () => this.loadCategories(),
            error: (error) => console.error('Error updating category:', error)
          });
        } else {
          this.servicesService.createCategory(result).subscribe({
            next: () => this.loadCategories(),
            error: (error) => console.error('Error creating category:', error)
          });
        }
      }
    });
  }

  deleteCategory(id: number, name: string) {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      this.servicesService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }

  // Provider methods
  loadProviders() {
    this.providersLoading = true;
    this.servicesService.getProviders().subscribe({
      next: (data) => {
        this.providers = data;
        this.providersLoading = false;
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.providersLoading = false;
      }
    });
  }

  openProviderDialog(provider?: ServiceProvider) {
    const dialogRef = this.dialog.open(ProviderDialogComponent, {
      width: '500px',
      data: provider ? { ...provider } : null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.servicesService.updateProvider(result.id, result).subscribe({
            next: () => this.loadProviders(),
            error: (error) => console.error('Error updating provider:', error)
          });
        } else {
          this.servicesService.createProvider(result).subscribe({
            next: () => this.loadProviders(),
            error: (error) => console.error('Error creating provider:', error)
          });
        }
      }
    });
  }

  deleteProvider(id: number, name: string) {
    if (confirm(`Are you sure you want to delete provider "${name}"?`)) {
      this.servicesService.deleteProvider(id).subscribe({
        next: () => this.loadProviders(),
        error: (error) => console.error('Error deleting provider:', error)
      });
    }
  }

  // Service methods
  loadServices() {
    this.servicesLoading = true;
    this.servicesService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.servicesLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.servicesLoading = false;
      }
    });
  }

  openServiceDialog(service?: Service) {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '600px',
      data: service ? { ...service } : null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.servicesService.updateService(result.id, result).subscribe({
            next: () => this.loadServices(),
            error: (error) => console.error('Error updating service:', error)
          });
        } else {
          this.servicesService.createService(result).subscribe({
            next: () => this.loadServices(),
            error: (error) => console.error('Error creating service:', error)
          });
        }
      }
    });
  }

  deleteService(id: number, title: string) {
    if (confirm(`Are you sure you want to delete service "${title}"?`)) {
      this.servicesService.deleteService(id).subscribe({
        next: () => this.loadServices(),
        error: (error) => console.error('Error deleting service:', error)
      });
    }
  }

  // Booking methods
  loadBookings() {
    this.bookingsLoading = true;
    this.servicesService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.bookingsLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.bookingsLoading = false;
      }
    });
  }

  openBookingDialog(booking?: ServiceBooking) {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '600px',
      data: booking ? { ...booking } : null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id) {
          this.servicesService.updateBooking(result.id, result).subscribe({
            next: () => this.loadBookings(),
            error: (error) => console.error('Error updating booking:', error)
          });
        } else {
          this.servicesService.createBooking(result).subscribe({
            next: () => this.loadBookings(),
            error: (error) => console.error('Error creating booking:', error)
          });
        }
      }
    });
  }

  deleteBooking(id: number, code: string) {
    if (confirm(`Are you sure you want to delete booking "${code}"?`)) {
      this.servicesService.deleteBooking(id).subscribe({
        next: () => this.loadBookings(),
        error: (error) => console.error('Error deleting booking:', error)
      });
    }
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'active': '#4CAF50',
      'pending': '#FF9800',
      'confirmed': '#2196F3',
      'completed': '#4CAF50',
      'cancelled': '#F44336',
      'paid': '#4CAF50',
      'available': '#4CAF50',
      'inactive': '#9E9E9E'
    };
    return statusColors[status] || '#9E9E9E';
  }
}
