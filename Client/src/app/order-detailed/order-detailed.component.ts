import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../shared/models/order';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order?: Order;
  errorMessage: string | undefined;
  constructor(private orderService: OrdersService, private route: ActivatedRoute,) {
  
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    id && this.orderService.getOrderDetailed(+id).subscribe({
      next: order => {
        this.order = order;
        console.log(this.order);
      },
      error: error => {
        this.errorMessage = error.error.message;
      }
    })
  }
}