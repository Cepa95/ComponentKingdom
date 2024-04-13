import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { CustomerParams } from '../../shared/models/customerParams';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
  modalRef: BsModalRef | undefined;
  customerIdToDelete: string | undefined;

  constructor(private adminService: AdminService, private router: Router, private modalService:BsModalService) {}

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

  openModal(template: TemplateRef<any>, customerId: string) {
    this.customerIdToDelete = customerId;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
    });
  }

  confirmDelete() {
    if (this.customerIdToDelete !== undefined) {
      this.adminService.deleteCustomer(this.customerIdToDelete).subscribe({
        next: () => {
          if (this.modalRef) {
            this.modalRef.hide();
          }
          this.customers = this.customers.filter((c) => c.id !== this.customerIdToDelete);
        },
        error: () => {
          console.log(
            'An error occurred while deleting the customer. Please try again.'
          );
        },
      });
    }
  }
}
