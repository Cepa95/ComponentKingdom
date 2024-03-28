import { Component, Input, OnInit } from '@angular/core';
import { DeliveryMethod } from '../../shared/models/deliveryMethod';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss',
})
export class CheckoutDeliveryComponent implements OnInit {
  constructor(private checkoutService: CheckoutService) {}

  @Input() checkoutForm: FormGroup | undefined;
  deliveryMethods: DeliveryMethod[] = [];

  ngOnInit(): void {
    this.checkoutService.getDeliveryMethods().subscribe({
      next: (dm) => (this.deliveryMethods = dm),
    });
  }
}
