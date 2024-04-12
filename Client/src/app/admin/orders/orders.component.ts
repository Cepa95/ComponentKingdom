import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { OrderParams } from '../../shared/models/orderParams';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  orders: any[] = [];
  orderParams = new OrderParams();
  totalCount = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    console.log('Getting orders for page:', this.orderParams.pageIndex);
    this.adminService
      .getAllOrders(this.orderParams)
      .subscribe((response: any) => {
        this.orders = response.data;
        this.orderParams.pageIndex = response.pageIndex;
        this.orderParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      });
  }

  onPageChanged(event: any) {
    if (event && this.orderParams.pageIndex !== event) {
      this.orderParams.pageIndex = event;
      this.getOrders();
    }
  }

  onSearch() {
    if (this.searchTerm) {
      this.orderParams.search = this.searchTerm.nativeElement.value;
      this.orderParams.pageIndex = 1;
      this.getOrders();
    }
  }

  onReset() {
    if (this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.orderParams = new OrderParams();
    this.getOrders();
  }
}
