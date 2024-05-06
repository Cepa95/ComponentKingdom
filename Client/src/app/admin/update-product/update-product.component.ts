import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    pictureUrl: ['', Validators.required],
    productTypeId: ['', Validators.required],
    productBrandId: ['', Validators.required],
    productAvailable: ['', Validators.required],
  });
  productTypes: any[] = [];
  productBrands: any[] = [];
  error: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  updateProduct() {
    if (this.productForm.valid) {
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        this.adminService
          .updateProduct(+productId, this.productForm.value)
          .subscribe(() => {
            this.router.navigate(['/shop']);
          });
      } else {
        this.error =
          'An error occurred while updating the product. Please try again.';
      }
    }
  }

  initializeForm(): void {
    this.adminService
      .getTypes()
      .subscribe((productTypes: any) => (this.productTypes = productTypes));
    this.adminService
      .getBrands()
      .subscribe((productBrands: any) => (this.productBrands = productBrands));
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.adminService.getProduct(+productId).subscribe((product: any) => {
        this.productForm.setValue({
          name: product.name,
          description: product.description,
          price: product.price,
          pictureUrl: product.pictureUrl,
          productTypeId: product.productTypeId,
          productBrandId: product.productBrandId,
          productAvailable: product.productAvailable,
        });
      });
    } else {
      this.error =
        'An error occurred while updating the product. Please try again.';
    }
  }
}
