import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product';
import { Pagination } from '../shared/models/pagination';
import { Customer } from '../shared/models/customer';
import { CustomerParams } from '../shared/models/customerParams';
import { Type } from '../shared/models/type';
import { Brand } from '../shared/models/brand';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = 'https://localhost:5001/api/';
  product?: Product;

  constructor(private http: HttpClient) {}

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + 'admin/products/' + id);
  }

  getProduct(id: number) {
    return this.http.get(this.baseUrl + 'admin/product/' + id);
  }

  updateProduct(id: number, product: any) {
    return this.http.put(this.baseUrl + 'admin/products/' + id, product);
  }

  getTypes() {
    return this.http.get<Type[]>(this.baseUrl + 'admin/types');
  }

  deleteType(id: number) {
    return this.http.delete(this.baseUrl + 'admin/types/' + id);
  }

  updateType(id: number, type: any) {
    return this.http.put(this.baseUrl + 'admin/types/' + id, type);
  }

  addType(type: Type) {
    return this.http.post(this.baseUrl + 'admin/types', type);
  }

  getBrands() {
    return this.http.get<Brand[]>(this.baseUrl + 'admin/brands');
  }

  deleteBrand(id: number) {
    return this.http.delete(this.baseUrl + 'admin/brands/' + id);
  }

  updateBrand(id: number, brand: any) {
    return this.http.put(this.baseUrl + 'admin/brands/' + id, brand);
  }

  addBrand(brand: Brand) {
    return this.http.post(this.baseUrl + 'admin/brands', brand);
  }

  addProduct(product: Product) {
    return this.http.post(this.baseUrl + 'admin/products', product);
  }

  getCustomers(customerParams: CustomerParams) {
    let params = new HttpParams();

    params = params.append('pageIndex', customerParams.pageIndex.toString());
    params = params.append('pageSize', customerParams.pageSize);
    if (customerParams.search)
      params = params.append('search', customerParams.search);

    return this.http.get<Pagination<Customer[]>>(
      this.baseUrl + 'admin/customers',
      { params }
    );
  }

  getAddress(id: string) {
    return this.http.get(this.baseUrl + 'admin/address/' + id);
  }

  updateAddress(userId: string, address: any) {
    return this.http.put(`${this.baseUrl}admin/address/${userId}`, address);
  }

  getProductSales() {
    return this.http.get(this.baseUrl + 'admin/products/sales');
  }

  getAllOrders() {
    return this.http.get(this.baseUrl + 'admin/orders');
  }
}
