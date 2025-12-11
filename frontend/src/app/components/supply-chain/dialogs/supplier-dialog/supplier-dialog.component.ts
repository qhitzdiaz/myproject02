import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SupplyChainService, Supplier } from '../../../../services/supply-chain.service';

@Component({
  selector: 'app-supplier-dialog',
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
  templateUrl: './supplier-dialog.component.html',
  styleUrls: ['./supplier-dialog.component.css']
})
export class SupplierDialogComponent {
  private supplyChainService = inject(SupplyChainService);
  private dialogRef = inject(MatDialogRef<SupplierDialogComponent>);

  supplier: Supplier = { name: '', status: 'active' };
  formData: Partial<Supplier> = {};
  isLoading = false;
  errorMessage = '';
  isEdit = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { supplier?: Supplier }) {
    if (data && data.supplier) {
      this.isEdit = true;
      this.supplier = { ...data.supplier };
      this.formData = { ...data.supplier };
    } else {
      this.formData = { status: 'active' };
    }
  }

  onSave() {
    if (!this.formData.name || !this.formData.name.trim()) {
      this.errorMessage = 'Supplier name is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEdit && this.supplier.id) {
      this.supplyChainService.updateSupplier(this.supplier.id, this.formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update supplier';
          console.error(error);
        }
      });
    } else {
      this.supplyChainService.createSupplier(this.formData as Supplier).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to create supplier';
          console.error(error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
