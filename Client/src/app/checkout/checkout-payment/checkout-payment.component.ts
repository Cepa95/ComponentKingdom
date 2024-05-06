import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import {
  loadStripe,
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
} from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { CheckoutService } from '../checkout.service';
import { BasketService } from '../../basket/basket.service';
import { Basket } from '../../shared/models/basket';
import { OrderToCreate } from '../../shared/models/order';
import { Address } from '../../shared/models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
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
  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;
  cardErrors: any;
  loading = false;
  cardProblemError: any;

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
          this.cardNumberComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });

        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
        this.cardExpiry.on('change', (event) => {
          this.cardExpiryComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });

        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.mount(this.cardCvcElement?.nativeElement);
        this.cardCvc.on('change', (event) => {
          this.cardCvcComplete = event.complete;
          if (event.error) this.cardErrors = event.error.message;
          else this.cardErrors = null;
        });
      }
    });
  }

  get paymentFormComplete() {
    return (
      this.checkoutForm?.get('paymentForm')?.valid &&
      this.cardNumberComplete &&
      this.cardExpiryComplete &&
      this.cardCvcComplete
    );
  }

  decodeToken() {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('token');
    const decodedToken = token ? helper.decodeToken(token) : null;
    const email = decodedToken?.email;
    return email;
  }

  async submitOrder() {
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) throw new Error('cannot get basket');
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);
      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
      } else {
        this.cardProblemError =
          paymentResult.error?.message || 'Problem with payment';
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        this.cardProblemError = 'Product is not available in required quantity'
      } else {
        this.cardProblemError = error.message;
      }
    } finally {
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    const email = this.decodeToken();
    const result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
      payment_method: {
        card: this.cardNumber!,
        billing_details: {
          email: email,
          name:
            this.checkoutForm?.get('addressForm')?.get('firstName')?.value +
            ' ' +
            this.checkoutForm?.get('addressForm')?.get('lastName')?.value +
            ' with ordered products:' +
            ' ' +
            basket.items
              .map(
                (item) =>
                  `${item.productName} ( ItemId: ${item.id}, Quantity: ${item.quantity}, Price: ${item.price}€)`
              )
              .join(', ') +
            '. Shipping price: ' + basket.shippingPrice + '€',
          

          address: {
            line1: this.checkoutForm?.get('addressForm')?.get('street')?.value,
            city: this.checkoutForm?.get('addressForm')?.get('city')?.value,
            state: this.checkoutForm?.get('addressForm')?.get('state')?.value,
            postal_code: this.checkoutForm?.get('addressForm')?.get('zipCode')
              ?.value,
          },
        },
      },
    });
    if (!result) throw new Error('Problem attempting payment with stripe');
    return result;
  }

  private async createOrder(basket: Basket | null) {
    if (!basket) throw new Error('Basket is null');
    const orderToCreate = this.getOrderToCreate(basket);
    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: Basket): OrderToCreate {
    const deliveryMethodId = this.checkoutForm
      ?.get('deliveryForm')
      ?.get('deliveryMethod')?.value;
    const shipToAddress = this.checkoutForm?.get('addressForm')
      ?.value as Address;
    if (!deliveryMethodId || !shipToAddress)
      throw new Error('Problem with basket');
    return {
      basketId: basket.id,
      deliveryMethodId: deliveryMethodId,
      shipToAddress: shipToAddress,
    };
  }
}
