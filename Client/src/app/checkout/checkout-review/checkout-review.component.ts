import { Component } from '@angular/core';
import { BasketService } from '../../basket/basket.service';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss',
})
export class CheckoutReviewComponent {
  constructor(private basketService: BasketService) {}

  createPaymentIntent() {
    this.basketService.createPaymentIntent().subscribe({
      next: () => console.log('Payment Intent Created'),
      error: (error) => console.log(error),
    });
  }
}
