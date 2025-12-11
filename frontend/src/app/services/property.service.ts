import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Property {
  id: number;
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  property_type: string;
  status: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year_built?: number;
  image_url?: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyStats {
  total_properties: number;
  available: number;
  rented: number;
  sold: number;
  maintenance: number;
  monthly_revenue: number;
  avg_price: number;
}

export interface Tenant {
  id: number;
  property_id: number;
  full_name: string;
  email: string;
  phone?: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  deposit_amount?: number;
  status: string;
  property_title?: string;
  property_address?: string;
}

export interface MaintenanceRequest {
  id: number;
  property_id: number;
  tenant_id?: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  requested_date: string;
  completed_date?: string;
  cost?: number;
  property_title?: string;
  property_address?: string;
  tenant_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = environment.propertyApiUrl;

  // Properties
  getProperties(filters?: any): Observable<Property[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<Property[]>(`${this.apiUrl}/properties`, { params });
  }

  getProperty(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/properties/${id}`);
  }

  createProperty(property: Partial<Property>): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/properties`, property);
  }

  updateProperty(id: number, property: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/properties/${id}`, property);
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/properties/${id}`);
  }

  getPropertyStats(): Observable<PropertyStats> {
    return this.http.get<PropertyStats>(`${this.apiUrl}/properties/stats/summary`);
  }

  // Tenants
  getTenants(filters?: any): Observable<Tenant[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<Tenant[]>(`${this.apiUrl}/tenants`, { params });
  }

  getTenant(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/tenants/${id}`);
  }

  createTenant(tenant: Partial<Tenant>): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.apiUrl}/tenants`, tenant);
  }

  updateTenant(id: number, tenant: Partial<Tenant>): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/tenants/${id}`, tenant);
  }

  deleteTenant(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tenants/${id}`);
  }

  // Maintenance
  getMaintenanceRequests(filters?: any): Observable<MaintenanceRequest[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<MaintenanceRequest[]>(`${this.apiUrl}/maintenance`, { params });
  }

  createMaintenanceRequest(request: Partial<MaintenanceRequest>): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(`${this.apiUrl}/maintenance`, request);
  }

  updateMaintenanceRequest(id: number, request: Partial<MaintenanceRequest>): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.apiUrl}/maintenance/${id}`, request);
  }

  deleteMaintenanceRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/maintenance/${id}`);
  }
}
