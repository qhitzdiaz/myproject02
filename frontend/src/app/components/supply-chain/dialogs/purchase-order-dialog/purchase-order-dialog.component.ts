import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SupplyChainService, PurchaseOrder, Supplier, Product } from '../../../../services/supply-chain.service';

@Component({
  selector: 'app-purchase-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './purchase-order-dialog.component.html',
  styleUrls: ['./purchase-order-dialog.component.css']
})
export class PurchaseOrderDialogComponent implements OnInit {
  private supplyChainService = inject(SupplyChainService);
  private dialogRef = inject(MatDialogRef<PurchaseOrderDialogComponent>);

  purchaseOrder: PurchaseOrder = { po_number: '', supplier_id: 0, order_date: '', status: 'pending' };
  formData: Partial<PurchaseOrder> = {};
  isLoading = false;
  errorMessage = '';
  isEdit = false;

  suppliers: Supplier[] = [];
  products: Product[] = [];
  suppliersLoaded = false;
  productsLoaded = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { purchaseOrder?: PurchaseOrder }) {
    if (data && data.purchaseOrder) {
      this.isEdit = true;
      this.purchaseOrder = { ...data.purchaseOrder };
      this.formData = { ...data.purchaseOrder };
    } else {
      this.formData = { status: 'pending', items: [] };
    }
  }

  ngOnInit() {
    this.loadSuppliers();
    this.loadProducts();
  }

  loadSuppliers() {
    this.supplyChainService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.suppliersLoaded = true;
      },
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }

  loadProducts() {
    this.supplyChainService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.productsLoaded = true;
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  onSave() {
    if (!this.formData.po_number || !this.formData.po_number.trim()) {
      this.errorMessage = 'PO number is required';
      return;
    }
    if (!this.formData.supplier_id) {
      this.errorMessage = 'Supplier is required';
      return;
    }
    if (!this.formData.order_date) {
      this.errorMessage = 'Order date is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEdit && this.purchaseOrder.id) {
      this.supplyChainService.updatePurchaseOrder(this.purchaseOrder.id, this.formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Failed to update PO';
          console.error(error);
        }
      });
    } else {
      this.supplyChainService.createPurchaseOrder(this.formData as PurchaseOrder).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Failed to create PO';
          console.error(error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
