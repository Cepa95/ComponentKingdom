import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { ShopModule } from '../shop/shop.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ShopModule,
  ],
  exports: [
    HomeComponent
  ]
  
})
export class HomeModule { }
