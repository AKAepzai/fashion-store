import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductlistComponent } from './components/productlist/productlist.component';
import { DetailComponent } from './components/detail/detail.component';
import { CategoryComponent } from './components/category/category.component';
import { ActivatedRoute, RouterModule, provideRouter } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { DiscountComponent } from './components/productlist/discount/discount.component';
import { HotProductComponent } from './components/productlist/hot-product/hot-product.component';
import { CartComponent } from './components/cart/cart.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from './components/layout/header/header.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { BillComponent } from './components/cart/bill/bill.component';
import { UserComponent } from './components/user/user.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/admin/login/login.component';
import { ResigterComponent } from './components/admin/resigter/resigter.component';
import { AdminModule } from './components/admin/admin.module';
@NgModule({
  declarations: [
    AppComponent,
    ProductlistComponent,
    HeaderComponent,
    DetailComponent,
    CategoryComponent,
    CartComponent,
    HomeComponent,
    FooterComponent,
    DiscountComponent,
    HotProductComponent,
    DashboardComponent,
    BillComponent,
    UserComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    AdminModule
  ],
  providers: [
    [ provideClientHydration() , provideHttpClient()]

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
