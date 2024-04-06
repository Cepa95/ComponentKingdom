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
import { JwtHelperService } from '@auth0/angular-jwt';


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
  cardProblemError: any;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private router: Router,
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

  decodeToken() {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('token');
    const decodedToken = token ? helper.decodeToken(token) : null;
    const email = decodedToken?.email;
    return email;
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) return;
    const orderToCreate = this.getOrderToCreate(basket);
    if (!orderToCreate) return;
    const email = this.decodeToken();
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: (order) => {
        this.stripe
          ?.confirmCardPayment(basket.clientSecret!, {
            payment_method: {
              card: this.cardNumber!, 
              billing_details: {
                email: email,
                name:
                  this.checkoutForm?.get('addressForm')?.get('firstName')
                    ?.value +
                  ' ' +
                  this.checkoutForm?.get('addressForm')?.get('lastName')
                    ?.value +
                  ' with ordered products:' +
                  ' ' +
                  basket.items
                    .map(
                      (item) =>
                        `${item.productName} ( ItemId: ${item.id}, Quantity: ${item.quantity}, Price: ${item.price}€)`
                    )
                    .join(', '),

                address: {
                  line1: this.checkoutForm?.get('addressForm')?.get('street')
                    ?.value,
                  city: this.checkoutForm?.get('addressForm')?.get('city')
                    ?.value,
                  state: this.checkoutForm?.get('addressForm')?.get('state')
                    ?.value,
                  postal_code: this.checkoutForm
                    ?.get('addressForm')
                    ?.get('zipCode')?.value,
                },
              },
            },
          })
          .then((result) => {
            console.log(result);
            if (result.paymentIntent) {
              this.basketService.deleteLocalBasket();
              const navigationExtras: NavigationExtras = { state: order };
              this.router.navigate(['checkout/success'], navigationExtras);
            } else {
              this.cardProblemError = result.error.message;
            }
          });
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
