import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { TooltipModule } from 'ngx-bootstrap/tooltip'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TooltipModule.forRoot(),
    BrowserAnimationsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
