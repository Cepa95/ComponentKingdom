import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    NavBarComponent,
    NotFoundComponent,
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    NgbDropdownModule
  ],
  exports: [
    NavBarComponent,
    NgxSpinnerModule
  ]
})
export class CoreModule { }
