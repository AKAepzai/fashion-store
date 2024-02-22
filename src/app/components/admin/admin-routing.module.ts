import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminModule } from './admin.module';
import { LoginComponent } from './login/login.component';
import { ResigterComponent } from './resigter/resigter.component';
import { ControlBillComponent } from './control-bill/control-bill.component';

const routes: Routes = [
  {
  path: 'admin',
  component: AdminModule,
  children: [
  {
  path: '',
  children: [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:username', component: LoginComponent },
  { path: 'sigin', component: ResigterComponent},
  { path: 'demo', component: ControlBillComponent},


  ]
}
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
