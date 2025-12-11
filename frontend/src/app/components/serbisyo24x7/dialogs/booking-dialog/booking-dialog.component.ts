import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ServicesManagementService, ServiceBooking, Service } from '../../../../services/services-management.service';

@Component({
  selector: 'app-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.css']
})
export class BookingDialogComponent implements OnInit {
  booking: any;
  isEditMode = false;
  services: Service[] = [];
  minDate: Date;
  private servicesService = inject(ServicesManagementService);

  constructor(
    public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceBooking | null
  ) {
    this.minDate = new Date();
    
    if (data) {
      this.isEditMode = true;
      this.booking = { 
        ...data, 
        booking_date: typeof data.booking_date === 'string' ? new Date(data.booking_date) : data.booking_date
      };
    } else {
      this.booking = {
        booking_code: this.generateBookingCode(),
        service_id: 0,
        provider_id: 0,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        booking_date: new Date(),
        total_price: 0,
        status: 'pending',
        payment_status: 'pending',
        special_requests: ''
      };
    }
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.servicesService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data;
      },
      error: (error: any) => {
        console.error('Error loading services:', error);
      }
    });
  }

  generateBookingCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BK-${random}${timestamp}`;
  }

  onServiceSelected(): void {
    const selected = this.services.find(s => s.id === this.booking.service_id);
    if (selected) {
      this.booking.total_price = selected.price || 0;
      this.booking.provider_id = selected.provider_id || 0;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.booking.customer_name?.trim() && 
        this.booking.customer_email?.trim() && 
        this.booking.service_id > 0) {
      this.dialogRef.close(this.booking);
    }
  }
}
