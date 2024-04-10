import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  hasAddress = false;

  addressForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
  });
  error: string | undefined;
  errorMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  updateAddress() {
    if (this.addressForm.valid) {
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        this.adminService
          .updateAddress(userId, this.addressForm.value)
          .pipe(
            catchError((error) => {
              this.error = error.error.message;
              return of(null);
            })
          )
          .subscribe(() => {
            if (!this.error) {
              this.router.navigate(['/admin/customers']);
            }
          });
      } else {
        this.errorMessage =
          'An error occurred while updating the address. Please try again.';
      }
    }
  }

  initializeForm(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.adminService.getAddress(userId).subscribe({
        next: (address: any) => {
          if (address) {
            this.hasAddress = true;
            this.addressForm.setValue({
              firstName: address.firstName,
              lastName: address.lastName,
              street: address.street,
              city: address.city,
              state: address.state,
              zipCode: address.zipCode,
            });
          } else {
            this.error = 'No address found for this user.';
          }
        },
        error: (error) => {
          this.error = error.error.message;
        },
      });
    } else {
      this.errorMessage =
        'An error occurred while retrieving the address. Please try again.';
    }
  }
}
