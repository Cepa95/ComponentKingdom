import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { UpdateProductComponent } from './update-product/update-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CustomersComponent } from './customers/customers.component';
import { AddressComponent } from './address/address.component';
import { TypesComponent } from './types/types.component';
import { BrandsComponent } from './brands/brands.component';
import { UpdateBrandComponent } from './update-brand/update-brand.component';
import { UpdateTypeComponent } from './update-type/update-type.component';
import { AddTypeComponent } from './add-type/add-type.component';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { ChartsComponent } from './charts/charts.component';
import { OrdersComponent } from './orders/orders.component';

const routes: Routes = [
  { path: '', component: AdminComponent, canActivate: [AdminGuard] },
  {
    path: 'update-product/:id',
    component: UpdateProductComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'addresses/:id',
    component: AddressComponent,
    canActivate: [AdminGuard],
  },
  { path: 'types', component: TypesComponent, canActivate: [AdminGuard] },
  { path: 'brands', component: BrandsComponent, canActivate: [AdminGuard] },
  {
    path: 'update-brand/:id',
    component: UpdateBrandComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'update-type/:id',
    component: UpdateTypeComponent,
    canActivate: [AdminGuard],
  },
  { path: 'add-type', component: AddTypeComponent, canActivate: [AdminGuard] },
  { path: 'add-brand', component: AddBrandComponent, canActivate: [AdminGuard] },
  { path: 'charts', component: ChartsComponent, canActivate: [AdminGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AdminGuard] },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
