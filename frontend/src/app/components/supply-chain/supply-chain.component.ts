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
import { SupplyChainService, Supplier, Product, PurchaseOrder } from '../../services/supply-chain.service';
import { SupplierDialogComponent } from './dialogs/supplier-dialog/supplier-dialog.component';
import { ProductDialogComponent } from './dialogs/product-dialog/product-dialog.component';
import { PurchaseOrderDialogComponent } from './dialogs/purchase-order-dialog/purchase-order-dialog.component';

@Component({
  selector: 'app-supply-chain',
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
    MatTooltipModule
  ],
  templateUrl: './supply-chain.component.html',
  styleUrls: ['./supply-chain.component.css']
})
export class SupplyChainComponent implements OnInit {
  private supplyChainService = inject(SupplyChainService);
  private dialog = inject(MatDialog);

  // Suppliers
  suppliers: Supplier[] = [];
  suppliersLoading = true;
  suppliersColumns = ['name', 'contact_person', 'email', 'city', 'status', 'actions'];

  // Products
  products: Product[] = [];
  productsLoading = true;
  productsColumns = ['sku', 'name', 'category', 'unit_price', 'reorder_level', 'status', 'actions'];

  // Purchase Orders
  purchaseOrders: PurchaseOrder[] = [];
  poLoading = true;
  poColumns = ['po_number', 'supplier_name', 'order_date', 'expected_delivery', 'status', 'actions'];

  ngOnInit() {
    this.loadSuppliers();
    this.loadProducts();
    this.loadPurchaseOrders();
  }

  // Supplier methods
  loadSuppliers() {
    this.suppliersLoading = true;
    this.supplyChainService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.suppliersLoading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.suppliersLoading = false;
      }
    });
  }

  openSupplierDialog(supplier?: Supplier) {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      width: '500px',
      data: supplier ? { supplier: { ...supplier } } : {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  deleteSupplier(id: number, name: string) {
    if (confirm(`Are you sure you want to delete supplier "${name}"?`)) {
      this.supplyChainService.deleteSupplier(id).subscribe({
        next: () => this.loadSuppliers(),
        error: (error) => console.error('Error deleting supplier:', error)
      });
    }
  }

  // Product methods
  loadProducts() {
    this.productsLoading = true;
    this.supplyChainService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.productsLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.productsLoading = false;
      }
    });
  }

  openProductDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: product ? { product: { ...product } } : {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: number, name: string) {
    if (confirm(`Are you sure you want to delete product "${name}"?`)) {
      this.supplyChainService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }

  // Purchase Order methods
  loadPurchaseOrders() {
    this.poLoading = true;
    this.supplyChainService.getPurchaseOrders().subscribe({
      next: (data) => {
        this.purchaseOrders = data;
        this.poLoading = false;
      },
      error: (error) => {
        console.error('Error loading purchase orders:', error);
        this.poLoading = false;
      }
    });
  }

  openPODialog(po?: PurchaseOrder) {
    const dialogRef = this.dialog.open(PurchaseOrderDialogComponent, {
      width: '600px',
      data: po ? { purchaseOrder: { ...po } } : {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPurchaseOrders();
      }
    });
  }

  deletePO(id: number, poNumber: string) {
    if (confirm(`Are you sure you want to delete purchase order "${poNumber}"?`)) {
      this.supplyChainService.deletePurchaseOrder(id).subscribe({
        next: () => this.loadPurchaseOrders(),
        error: (error) => console.error('Error deleting PO:', error)
      });
    }
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'active': '#4CAF50',
      'pending': '#FF9800',
      'confirmed': '#2196F3',
      'delivered': '#4CAF50',
      'inactive': '#9E9E9E'
    };
    return statusColors[status] || '#9E9E9E';
  }
}
