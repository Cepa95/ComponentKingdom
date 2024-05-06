import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from '../../basket/basket.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  errorMessage: string | undefined;
  errorCode: number | undefined;
  quantity = 1;
  quantityInBasket = 0;

  constructor(
    public shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.shopService.getProduct(+id).subscribe({
        next: (product) => {
          this.product = product;
          this.basketService.basketSource$.pipe(take(1)).subscribe({
            next: (basket) => {
              const item = basket?.items.find((x) => x.id === +id);
              if (item) {
                this.quantity = item.quantity;
                this.quantityInBasket = item.quantity;
              }
            },
          });
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.errorMessage = 'Failed to load product. No product found!';
          this.errorCode = error.status;
        },
      });
    } else {
      this.errorMessage = 'Failed to load product.';
    }
  }

  incrementQuantity() {
    if (this.product && this.quantity < this.product.productAvailable) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    this.quantity--;
    if (this.quantity < 0) this.quantity = 0;
  }

  updateBasket() {
    if (this.product) {
      if (this.quantity > this.quantityInBasket) {
        const itemsToAdd = this.quantity - this.quantityInBasket;
        this.quantityInBasket += itemsToAdd;
        this.basketService.addItemToBasket(this.product, itemsToAdd);
      } else {
        const itemsToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= itemsToRemove;
        this.basketService.removeItemFromBasket(this.product.id, itemsToRemove);
      }
    }
  }

  get buttonText(){
    return this.quantityInBasket === 0 ? 'Add to basket' : 'Update basket';
  }
}
