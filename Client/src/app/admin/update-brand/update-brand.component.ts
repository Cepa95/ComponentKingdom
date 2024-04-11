import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.scss'],
})
export class UpdateBrandComponent implements OnInit {
  brandForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  brandId?: number;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.brandId = +this.route.snapshot.paramMap.get('id')!;
  }

  onSubmit() {
    if (this.brandForm.valid) {
      if (this.brandId) {
        this.adminService
          .updateBrand(this.brandId, this.brandForm.value)
          .pipe(
            catchError((error: any) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe((response) => {
            if (response) {
              console.log(response);
              this.router.navigate(['/admin/brands']);
            }
          });
      } else {
        console.error('Brand id is not defined');
      }
    }
  }
}
