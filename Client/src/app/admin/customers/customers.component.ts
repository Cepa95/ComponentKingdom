import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { CustomerParams } from '../../shared/models/customerParams';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  customers: any[] = [];
  customerParams = new CustomerParams();
  totalCount = 0;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers() {
    console.log('Getting customers for page:', this.customerParams.pageIndex);
    this.adminService
      .getCustomers(this.customerParams)
      .subscribe((response) => {
        this.customers = response.data;
        this.customerParams.pageIndex = response.pageIndex;
        this.customerParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      });
  }

  onPageChanged(event: any) {
    if (event && this.customerParams.pageIndex !== event) {
      this.customerParams.pageIndex = event;
      this.getCustomers();
    }
  }

  onSearch() {
    this.customerParams.search = this.searchTerm?.nativeElement.value;
    this.customerParams.pageIndex = 1;
    this.getCustomers();
  }

  onReset() {
    if(this.searchTerm) this.searchTerm.nativeElement.value = '';
    this.customerParams = new CustomerParams();
    this.getCustomers();
  }
}
