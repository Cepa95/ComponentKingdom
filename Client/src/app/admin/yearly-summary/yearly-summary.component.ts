import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-yearly-summary',
  templateUrl: './yearly-summary.component.html',
  styleUrl: './yearly-summary.component.scss'
})
export class YearlySummaryComponent implements OnInit {


  yearSalesData: any[] = [];
  selectedYear = new Date().getFullYear();
  years = Array.from({length: 5}, (_, i) => this.selectedYear - i);
  
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.getProductSalesByYear(this.selectedYear);
  }

  getProductSalesByYear(year: number) {
    this.adminService.getProductSalesByYear(year).subscribe((data: any) => {
      this.yearSalesData = data
        .map((item: { productName: string; quantitySold: number }) => ({
          name: item.productName,
          value: item.quantitySold,
        }))
        .slice(0, 10);
    });
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.getProductSalesByYear(year);
  }

}
