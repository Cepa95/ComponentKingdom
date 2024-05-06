import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
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
export class ProductItemComponent implements OnInit {
  @Input() product?: Product;
  @Output() productDeleted = new EventEmitter();
  modalRef?: BsModalRef;
  quantityInBasket = 0;

  constructor(
    private basketService: BasketService,
    private adminService: AdminService,
    private jwtHelper: JwtHelperService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadQuantityInBasket();
  }

  addItemToBasket() {
    if (this.product && this.product.productAvailable && this.product.productAvailable - this.quantityInBasket > 0) {
      this.basketService.addItemToBasket(this.product);
      this.quantityInBasket++;
    }
  }

  loadQuantityInBasket() {
    this.basketService.basketSource$.subscribe({
      next: (basket) => {
        const item = basket?.items.find((x) => x.id === this.product?.id);
        if (item) {
          this.quantityInBasket = item.quantity;
        }
      },
    });
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
