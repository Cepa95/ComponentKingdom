import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Type } from '../shared/models/type';
import { Brand } from '../shared/models/brand';
import { ShopParams } from '../shared/models/shopParams';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account/account.service';
import { AdminService } from '../admin/admin.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  @ViewChild('search') search?: ElementRef;
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopParams = new ShopParams();
  sortOptions = [
    { name: 'Alphabetical: A to Z', value: 'name' },
    { name: 'Alphabetical: Z to A', value: 'nameDesc' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  totalCount = 0;
  routeSubscription: any;
  searchUpdated = new Subject<string>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopService: ShopService,
    public accountService: AccountService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
    this.loadProductType();
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.shopParams.typeId = +id;
        this.getProducts();
      }
    });
    this.searchUpdated.pipe(debounceTime(300)).subscribe((value) => {
      this.onSearch(value);
    });
  }

  loadProductType() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) this.shopParams.typeId = +id;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => {
        this.products = response.data;
        this.shopParams.pageIndex = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: (error) => console.log(error),
    });
  }
  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }
  getTypes() {
    this.shopService.getTypes().subscribe({
      next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  onBrandSelected(event: any) {
    this.shopParams.brandId = +event.target.value;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  getProductType(typeId: number) {
    this.shopService.getProductType(typeId).subscribe({
      next: (response) => (this.products = response.data),
      error: (error) => console.log(error),
    });
  }

  onSortSelected(event: any) {
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageIndex !== event) {
      this.shopParams.pageIndex = event;
      window.scrollTo(0, 0);
      this.getProducts();
    }
  }

  onSearch(value: string) {
    this.shopParams.search = value;
    this.shopParams.pageIndex = 1;
    this.getProducts();
  }

  handleProductDeleted(id: number) {
    this.products = this.products.filter((product) => product.id !== id);
    this.totalCount--;
  }
}
