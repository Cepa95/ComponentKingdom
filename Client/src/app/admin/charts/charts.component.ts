import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit{

  salesData: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.getProductSales();
  }

  getProductSales() {
    this.adminService.getProductSales().subscribe((data: any) => {
      this.salesData = data.map((item: { productName: string, quantitySold: number }) => ({
        name: item.productName,
        value: item.quantitySold
      }));
    });
  }


}
