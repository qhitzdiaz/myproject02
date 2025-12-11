import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ServiceCategory {
  id?: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceProvider {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  category_id: number;
  category_name?: string;
  rating: number;
  total_reviews?: number;
  address?: string;
  city?: string;
  experience_years?: number;
  certifications?: string;
  availability: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id?: number;
  title: string;
  description?: string;
  category_id: number;
  category_name?: string;
  provider_id: number;
  provider_name?: string;
  price?: number;
  duration_hours?: number;
  tags?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceBooking {
  id?: number;
  booking_code: string;
  service_id: number;
  service_title?: string;
  provider_id: number;
  provider_name?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  booking_date: string;
  booking_time?: string;
  duration_hours?: number;
  total_price?: number;
  special_requests?: string;
  status: string;
  payment_status: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesManagementService {
  private http = inject(HttpClient);
  private apiUrl = environment.servicesApiUrl || 'http://localhost:3003/api';

  // Category methods
  getCategories(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(`${this.apiUrl}/categories`);
  }

  getCategory(id: number): Observable<ServiceCategory> {
    return this.http.get<ServiceCategory>(`${this.apiUrl}/categories/${id}`);
  }

  createCategory(category: ServiceCategory): Observable<ServiceCategory> {
    return this.http.post<ServiceCategory>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: number, category: Partial<ServiceCategory>): Observable<ServiceCategory> {
    return this.http.put<ServiceCategory>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  // Provider methods
  getProviders(): Observable<ServiceProvider[]> {
    return this.http.get<ServiceProvider[]>(`${this.apiUrl}/providers`);
  }

  getProvider(id: number): Observable<ServiceProvider> {
    return this.http.get<ServiceProvider>(`${this.apiUrl}/providers/${id}`);
  }

  createProvider(provider: ServiceProvider): Observable<ServiceProvider> {
    return this.http.post<ServiceProvider>(`${this.apiUrl}/providers`, provider);
  }

  updateProvider(id: number, provider: Partial<ServiceProvider>): Observable<ServiceProvider> {
    return this.http.put<ServiceProvider>(`${this.apiUrl}/providers/${id}`, provider);
  }

  deleteProvider(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/providers/${id}`);
  }

  // Service methods
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/services`);
  }

  getService(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/services/${id}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}/services`, service);
  }

  updateService(id: number, service: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/services/${id}`, service);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/services/${id}`);
  }

  // Booking methods
  getBookings(): Observable<ServiceBooking[]> {
    return this.http.get<ServiceBooking[]>(`${this.apiUrl}/bookings`);
  }

  getBooking(id: number): Observable<ServiceBooking> {
    return this.http.get<ServiceBooking>(`${this.apiUrl}/bookings/${id}`);
  }

  createBooking(booking: ServiceBooking): Observable<ServiceBooking> {
    return this.http.post<ServiceBooking>(`${this.apiUrl}/bookings`, booking);
  }

  updateBooking(id: number, booking: Partial<ServiceBooking>): Observable<ServiceBooking> {
    return this.http.put<ServiceBooking>(`${this.apiUrl}/bookings/${id}`, booking);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/${id}`);
  }
}
