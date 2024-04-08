import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { UpdateProductComponent } from './update-product/update-product.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes : Routes = [
  {path: '', component: AdminComponent, canActivate: [AdminGuard]},
  { path: 'update-product/:id', component: UpdateProductComponent, canActivate: [AdminGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate: [AdminGuard] },
]



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
