import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { Product } from '../../shared/models/product';
import { BasketService } from '../../basket/basket.service';
import { AdminService } from '../../admin/admin.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input() product?: Product;
  @Output() productDeleted = new EventEmitter();
  modalRef?: BsModalRef;

  constructor(
    private basketService: BasketService,
    private adminService: AdminService,
    private jwtHelper: JwtHelperService,
    private modalService: BsModalService
  ) {}

  addItemToBasket() {
    this.product && this.basketService.addItemToBasket(this.product);
  }

  deleteProduct(id: number) {
    if (this.product) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          this.productDeleted.emit(id);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken.role as Array<string>;
      return roles && roles.includes('Admin');
    }
    return false;
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDelete(productId?: number) {
    if (productId !== undefined) {
      this.deleteProduct(productId);
      this.modalRef?.hide();
    } else {
      console.error('Product ID is undefined');
    }
  }

  
}
