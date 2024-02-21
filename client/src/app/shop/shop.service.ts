import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brandId > 0) params = params.append('brandId', shopParams.brandId);
    if (shopParams.typeId) params = params.append('typeId', shopParams.typeId);
    if (shopParams.sort) params = params.append('sort', shopParams.sort);
    if (shopParams.pageIndex) params = params.append('pageIndex', shopParams.pageIndex);
    if (shopParams.pageSize) params = params.append('pageSize', shopParams.pageSize);
    if (shopParams.search) params = params.append('search', shopParams.search);


    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {params: params})
  }

  getBrands(){
    return this.http.get<Brand[]>(this.baseUrl + 'products/brands')
  }

  getTypes(){
    return this.http.get<Type[]>(this.baseUrl + 'products/types')
  }

  getProductType(typeId: number){
    let params = new HttpParams();
    if (typeId) params = params.append('typeId', typeId);

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {params: params})
  }

}
