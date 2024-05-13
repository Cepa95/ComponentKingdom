import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.scss',
})
export class UpdateOrderComponent implements OnInit {

  productStatuses: { id: number, name: string }[] = [];

  orderForm: FormGroup = this.formBuilder.group({
    shipToAddress_FirstName: ['', Validators.required],
    shipToAddress_LastName: ['', Validators.required],
    shipToAddress_Street: ['', Validators.required],
    shipToAddress_City: ['', Validators.required],
    shipToAddress_State: ['', Validators.required],
    shipToAddress_ZipCode: ['', Validators.required],
    productStatus: ['', Validators.required],
  });
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.getProductStatuses().subscribe(statuses => {
    this.productStatuses = statuses;
  });
    this.initializeForm();
  }

  updateOrder() {
    if (this.orderForm.valid) {
      const orderId = this.route.snapshot.paramMap.get('id');
      if (orderId) {
        this.adminService
          .updateOrder(+orderId, this.orderForm.value)
          .subscribe(() => {
            this.router.navigate(['/admin/orders']); 
          });
      } else {
        this.error =
          'An error occurred while updating the order. Please try again.';
      }
    }
  }

  initializeForm(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.adminService.getOrder(+orderId).subscribe((order: any) => {
        this.orderForm = this.formBuilder.group({
          shipToAddress_FirstName: [order.shipToAddress.firstName, Validators.required],
          shipToAddress_LastName: [order.shipToAddress.lastName, Validators.required],
          shipToAddress_Street: [order.shipToAddress.street, Validators.required],
          shipToAddress_City: [order.shipToAddress.city, Validators.required],
          shipToAddress_State: [order.shipToAddress.state, Validators.required],
          shipToAddress_ZipCode: [order.shipToAddress.zipCode, Validators.required],
          productStatus: [order.productStatus, Validators.required],
        });
      });
    } else {
      this.error = 'An error occurred while updating the order. Please try again.';
    }
  }


}