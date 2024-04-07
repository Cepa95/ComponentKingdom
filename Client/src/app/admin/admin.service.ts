import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = 'https://localhost:5001/api/';

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
    return this.http.get(this.baseUrl + 'admin/types');
  }

  getBrands() {
    return this.http.get(this.baseUrl + 'admin/brands');
  }
}
