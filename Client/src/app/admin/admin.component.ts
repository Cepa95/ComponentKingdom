import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  salesData: any[] = [];
  yearSalesData: any[] = [];
  selectedYear = new Date().getFullYear();
  years = Array.from({length: 5}, (_, i) => this.selectedYear - i);

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
