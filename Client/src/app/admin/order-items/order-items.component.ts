import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.scss']
})
export class OrderItemsComponent implements OnInit {
  orderItems: any; 

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getOrderItemsByOrderId(+id);
    }
  }

  getOrderItemsByOrderId(id: number): void {
    this.adminService.getOrderItemsByOrderId(id).subscribe({
      next: (orderItems) => {
        this.orderItems = orderItems;
      },
      error: (error) => {
        console.error('Error occurred while fetching order items: ', error);
      }
    });
  }
}