import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountRoutingModule } from './account-routing.module';
import { share } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class AccountModule { }
