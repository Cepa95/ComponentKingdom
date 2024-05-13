import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OrdersComponent } from './orders/orders.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { FormsModule } from '@angular/forms';
import { YearlySummaryComponent } from './yearly-summary/yearly-summary.component';
import { UpdateOrderComponent } from './update-order/update-order.component';


@NgModule({
  declarations: [
    AdminComponent,
    UpdateProductComponent,
    AddProductComponent,
    CustomersComponent,
    AddressComponent,
    TypesComponent,
    BrandsComponent,
    UpdateBrandComponent,
    UpdateTypeComponent,
    AddTypeComponent,
    AddBrandComponent,
    ChartsComponent,
    OrdersComponent,
    OrderItemsComponent,
    YearlySummaryComponent,
    UpdateOrderComponent,
    
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    NgxChartsModule,
    FormsModule
  ]
})
export class AdminModule { }
