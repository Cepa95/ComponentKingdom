import { Component, OnInit, TemplateRef } from '@angular/core';
import { Brand } from '../../shared/models/brand';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  modalRef: BsModalRef | undefined;
  brandIdToDelete: number | undefined;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands() {
    this.adminService.getBrands().subscribe((response) => {
      this.brands = response;
    });
  }

  openModal(template: TemplateRef<any>, brandId: number) {
    this.brandIdToDelete = brandId;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
    });
  }

  confirmDelete() {
    if (this.brandIdToDelete !== undefined) {
      this.adminService.deleteBrand(this.brandIdToDelete).subscribe({
        next: () => {
          if (this.modalRef) {
            this.modalRef.hide();
          }
          this.brands = this.brands.filter((b) => b.id !== this.brandIdToDelete);
        },
        error: () => {
          console.log(
            'An error occurred while deleting the brand. Please try again.'
          );
        },
      });
    }
  }
}
