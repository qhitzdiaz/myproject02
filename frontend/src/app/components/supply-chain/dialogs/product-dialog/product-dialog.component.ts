import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SupplyChainService, Product } from '../../../../services/supply-chain.service';

@Component({
  selector: 'app-product-dialog',
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
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {
  private supplyChainService = inject(SupplyChainService);
  private dialogRef = inject(MatDialogRef<ProductDialogComponent>);

  product: Product = { sku: '', name: '', status: 'active' };
  formData: Partial<Product> = {};
  isLoading = false;
  errorMessage = '';
  isEdit = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { product?: Product }) {
    if (data && data.product) {
      this.isEdit = true;
      this.product = { ...data.product };
      this.formData = { ...data.product };
    } else {
      this.formData = { status: 'active' };
    }
  }

  onSave() {
    if (!this.formData.sku || !this.formData.sku.trim()) {
      this.errorMessage = 'SKU is required';
      return;
    }
    if (!this.formData.name || !this.formData.name.trim()) {
      this.errorMessage = 'Product name is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEdit && this.product.id) {
      this.supplyChainService.updateProduct(this.product.id, this.formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Failed to update product';
          console.error(error);
        }
      });
    } else {
      this.supplyChainService.createProduct(this.formData as Product).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Failed to create product';
          console.error(error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
