import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Type } from '../../shared/models/type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrl: './types.component.scss',
})
export class TypesComponent implements OnInit {
  types: Type[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.getTypes();
  }

  getTypes() {
    this.adminService.getTypes().subscribe((response) => {
      this.types = response;
    });
  }

  deleteType(id: number) {
    this.adminService.deleteType(id).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: () => {
        console.log(
          'An error occurred while deleting the type. Please try again.'
        );
      },
    });
  }

  
}
