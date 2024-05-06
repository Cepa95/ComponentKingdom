import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    pictureUrl: new FormControl(null, Validators.required),
    productTypeId: new FormControl(null, Validators.required),
    productBrandId: new FormControl(null, Validators.required),
    productAvailable: new FormControl(null, Validators.required),
  });

  productTypes: any[] = [];
  productBrands: any[] = [];
  error: string | undefined;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.adminService.getTypes().subscribe((types) => {
      this.productTypes = types as any;
    });

    this.adminService.getBrands().subscribe((brands) => {
      this.productBrands = brands as any;
    });
  }

  onSubmit() {
    this.adminService.addProduct(this.productForm.value).subscribe({
      next: () => {
        this.router.navigate(['/shop']);
      },
      error: () => {
        this.error =
          'An error occurred while adding the product. Please try again.';
      },
    });
  }
}
