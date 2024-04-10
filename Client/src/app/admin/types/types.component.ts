import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminService } from '../admin.service';
import { Type } from '../../shared/models/type';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss'],
})
export class TypesComponent implements OnInit {
  types: Type[] = [];
  modalRef: BsModalRef | undefined;
  typeIdToDelete: number | undefined;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getTypes();
  }

  getTypes() {
    this.adminService.getTypes().subscribe((response) => {
      this.types = response;
    });
  }

  openModal(template: TemplateRef<any>, typeId: number) {
    this.typeIdToDelete = typeId;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm',
    });
  }

  confirmDelete() {
    if (this.typeIdToDelete !== undefined) {
      this.adminService.deleteType(this.typeIdToDelete).subscribe({
        next: () => {
          if (this.modalRef) {
            this.modalRef.hide();
          }
          this.types = this.types.filter((t) => t.id !== this.typeIdToDelete);
        },
        error: () => {
          console.log(
            'An error occurred while deleting the type. Please try again.'
          );
        },
      });
    }
  }
}
