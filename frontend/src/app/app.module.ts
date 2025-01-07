import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './project/components/views/menu/menu.component';
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './project/components/views/welcome/welcome.component';
import { PaymentComponent } from './project/components/views/payment/payment.component';
import { StaffComponent } from './project/components/views/staff/staff.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    WelcomeComponent,
    PaymentComponent,
    StaffComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
