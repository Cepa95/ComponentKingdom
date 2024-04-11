import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-update-type',
  templateUrl: './update-type.component.html',
  styleUrl: './update-type.component.scss'
})
export class UpdateTypeComponent {
  typeForm: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  typeId?: number;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.typeId = +this.route.snapshot.paramMap.get('id')!;
  }

  onSubmit() {
    if (this.typeForm.valid) {
      if (this.typeId) {
        this.adminService
          .updateType(this.typeId, this.typeForm.value)
          .pipe(
            catchError((error: any) => {
              console.error(error);
              return of(null);
            })
          )
          .subscribe((response) => {
            if (response) {
              console.log(response);
              this.router.navigate(['/admin/types']);
            }
          });
      } else {
        console.error('Type id is not defined');
      }
    }
  }

}
