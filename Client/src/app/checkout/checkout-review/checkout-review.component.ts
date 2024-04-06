import { Component, Input } from '@angular/core';
import { BasketService } from '../../basket/basket.service';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrl: './checkout-review.component.scss',
})
export class CheckoutReviewComponent {
  @Input() appStepper?: CdkStepper;
  
  constructor(private basketService: BasketService) {}

  createPaymentIntent() {
    this.basketService.createPaymentIntent().subscribe({
      next: () => this.appStepper?.next(),
      error: (error) => console.log(error),
    });
  }
}
