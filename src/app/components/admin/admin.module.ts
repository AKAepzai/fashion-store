import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ResigterComponent } from './resigter/resigter.component';
import { ControlBillComponent } from './control-bill/control-bill.component';



@NgModule({
  declarations: [
    LoginComponent,
    ResigterComponent,
    ControlBillComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
