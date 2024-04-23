import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {
  brandForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  error?: string;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    if (this.brandForm.valid) {
      this.adminService.addBrand(this.brandForm.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/brands']);
        },
        error: (error) => {
          console.log(error)
          this.error = 'An error occurred while adding the brand. Please try again.';
        },
      });
    }
  }
}