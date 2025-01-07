import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './project/components/views/menu/menu.component';
import { WelcomeComponent } from './project/components/views/welcome/welcome.component';
import { PaymentComponent } from './project/components/views/payment/payment.component';
import { StaffComponent } from './project/components/views/staff/staff.component';

const routes: Routes = [
  {path:'menu', component:MenuComponent},
  {path:'staff', component:StaffComponent},
  {path:'', component:WelcomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
