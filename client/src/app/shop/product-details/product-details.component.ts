import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  errorMessage: string | undefined;
  errorCode: number | undefined;


  constructor(
    public shopService: ShopService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProduct();
    
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.shopService.getProduct(+id).subscribe({
        next: product => {
          this.product = product;
        },
        error: error => {
          console.error('Error loading product:', error);
          this.errorMessage = 'Failed to load product.'; 
          this.errorCode = error.status;
        }
      });
    } else {
      this.errorMessage = 'Failed to load product.'; 
    }
  }

  
}
