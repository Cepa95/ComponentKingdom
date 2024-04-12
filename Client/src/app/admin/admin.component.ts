import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  salesData: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getProductSales();
  }

  getProductSales() {
    this.adminService.getProductSales().subscribe((data: any) => {
      this.salesData = data
        .map((item: { productName: string; quantitySold: number }) => ({
          name: item.productName,
          value: item.quantitySold,
        }))
        .slice(0, 10);
    });
  }
}
