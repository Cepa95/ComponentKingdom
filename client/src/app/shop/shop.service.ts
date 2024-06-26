import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];

  constructor(private http: HttpClient) {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brandId > 0)
      params = params.append('brandId', shopParams.brandId);
    if (shopParams.typeId) params = params.append('typeId', shopParams.typeId);
    if (shopParams.sort) params = params.append('sort', shopParams.sort);
    if (shopParams.pageIndex)
      params = params.append('pageIndex', shopParams.pageIndex);
    if (shopParams.pageSize)
      params = params.append('pageSize', shopParams.pageSize);
    if (shopParams.search) params = params.append('search', shopParams.search);

    return this.http
      .get<Pagination<Product[]>>(this.baseUrl + 'products', {
        params: params,
      })
      .pipe(
        map((response) => {
          this.products = response.data;
          return response;
        })
      );
  }

  getBrands() {
    if (this.brands.length > 0) return of(this.brands);

    return this.http
      .get<Brand[]>(this.baseUrl + 'products/brands')
      .pipe(map((brands) => (this.brands = brands)));
  }

  getTypes() {
    if (this.types.length > 0) return of(this.types);

    return this.http
      .get<Type[]>(this.baseUrl + 'products/types')
      .pipe(map((types) => (this.types = types)));
  }

  getProductType(typeId: number) {
    let params = new HttpParams();
    if (typeId) params = params.append('typeId', typeId);

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {
      params: params,
    });
  }

  getProduct(id: number) {
    const product = this.products.find((p) => p.id === id);

    if (product) return of(product);

    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 404) {
      errorMessage = 'Product not found';
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}
