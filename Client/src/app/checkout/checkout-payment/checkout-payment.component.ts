import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from '../../basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { Basket } from '../../shared/models/basket';
import { Address } from '../../shared/models/user';
import { NavigationExtras, Router } from '@angular/router';
import {
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  loadStripe,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrl: './checkout-payment.component.scss',
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;
  @ViewChild('cardNumber') cardNumberElement?: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement?: ElementRef;
  @ViewChild('cardCvc') cardCvcElement?: ElementRef;

  stripe: Stripe | null = null;
  cardNumber?: StripeCardNumberElement;
  cardExpiry?: StripeCardExpiryElement;
  cardCvc?: StripeCardCvcElement;

  cardErrors: any;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}
  ngOnInit(): void {
    loadStripe(
      'pk_test_51P1pQQLb7q03XGFPtxIuGoRBAYC9WEc0aEs6cDTKWl79mIad86CsPa6ucQanLX6g14PyfA1g1zPggeWT9D7KqFSw007ZM2m3uw'
    ).then((stripe) => {
      this.stripe = stripe;
      const elements = stripe?.elements();
      if (elements) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.mount(this.cardNumberElement?.nativeElement);
        this.cardNumber.on('change', (event) => {
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change', (event) => {
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on('change', (event) => {
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });
      }
    });
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) return;
    const orderToCreate = this.getOrderToCreate(basket);
    if (!orderToCreate) return;
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: (order) => {
        this.basketService.deleteLocalBasket();
        const navigationExtras: NavigationExtras = { state: order };
        this.router.navigate(['checkout/success'], navigationExtras);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  private getOrderToCreate(basket: Basket) {
    const deliveryMethodId = this.checkoutForm
      ?.get('deliveryForm')
      ?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')
      ?.value as Address;
    if (!deliveryMethodId || !shipToAddress) return;
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress,
    };
  }
}
