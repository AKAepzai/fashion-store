// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductlistComponent } from './components/productlist/productlist.component';
import { DetailComponent } from './components/detail/detail.component';
import { CategoryComponent } from './components/category/category.component';
import { DiscountComponent } from './components/productlist/discount/discount.component';
import { HotProductComponent } from './components/productlist/hot-product/hot-product.component';
import { CartComponent } from './components/cart/cart.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { BillComponent } from './components/cart/bill/bill.component';
import { LoginComponent } from './components/admin/login/login.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  { path: 'products',
    children: [
      {path : '', component: ProductlistComponent},
      {path : ':id', component:DetailComponent}
    ]},
  { path: 'category/:id', component: CategoryComponent },
  { path: 'discount', component: DiscountComponent },
  { path: 'hot', component: HotProductComponent },
  { path: 'cart',component: CartComponent},
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'admin', component: DashboardComponent, canActivate : [AdminGuard]},
  { path: 'bill/:id',component: BillComponent},
  { path: 'user/:username', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
