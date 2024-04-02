import { NgModule } from '@angular/core';
import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [OrdersComponent],
  imports: [CommonModule, OrdersRoutingModule],
})
export class OrdersModule {}
