import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import { map } from 'rxjs';
import { Order, OrderToCreate } from '../shared/models/order';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) {}

  getDeliveryMethods() {
    return this.http
      .get<DeliveryMethod[]>(this.baseUrl + 'orders/deliveryMethods')
      .pipe(
        map((dm) => {
          return dm.sort((a, b) => b.price - a.price);
        })
      );
  }

  createOrder(order: OrderToCreate){
    return this.http.post<Order>(this.baseUrl + 'orders', order);
  }
}
