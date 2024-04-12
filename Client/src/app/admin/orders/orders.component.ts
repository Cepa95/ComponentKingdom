import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{


  orders: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.adminService.getAllOrders().subscribe((data: any) => {
      this.orders = data;
    });
  }

}
