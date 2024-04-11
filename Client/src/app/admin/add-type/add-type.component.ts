import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.scss']
})
export class AddTypeComponent implements OnInit {
  typeForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  error: string | undefined;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    if (this.typeForm.valid) {
      this.adminService.addType(this.typeForm.value).subscribe({
        next: () => {
          this.router.navigate(['/admin/types']);
        },
        error: () => {
          this.error = 'An error occurred while adding the type. Please try again.';
        },
      });
    }
  }
}