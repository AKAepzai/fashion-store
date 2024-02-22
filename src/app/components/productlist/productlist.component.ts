import { Component } from '@angular/core';

import { CartService } from '../../service/cart.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { IProduct } from '../../entities/products';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductlistComponent {
  constructor(private cartService: CartService, private http: HttpClient, private authService: AuthService) {}
  listProduct: IProduct[] = [];
  products: IProduct[] = [];
  filterValue: string = '';
  p : number =0;
  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/products').subscribe(
      (data: any[]) => {
        this.products = data;
        this.listProduct = this.products;
      }
    );
  }

  filterProduct(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.listProduct = this.products.filter(p => p.name.toLowerCase().includes(this.filterValue.toLowerCase()));
  }
  sortProductsLowToHigh(): void {
    this.listProduct = this.listProduct.sort((a, b) => a.price - b.price);
  }
  sortProductsHighToLow(): void {
    this.listProduct = this.listProduct.sort((a, b) => b.price - a.price);
  }
  Newproducts(){
    const sortedProducts = this.products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.listProduct = sortedProducts;
  }
  Oldproducts(){
    const oldedProduct = this.products.sort((a,b) => new Date(a.date).getTime() -new Date(b.date).getTime());
    this.listProduct= oldedProduct;
  }
  onSortChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    switch (selectedValue) {
      case 'lowToHigh':
        this.sortProductsLowToHigh();
        break;
      case 'highToLow':
        this.sortProductsHighToLow();
        break;
      case 'newToOld':
        this.Newproducts();
        break;
      case 'oldToNew':
        this.Oldproducts();
        break;
      default:
      this.listProduct = [...this.products];
        break;
    }
  }
  buyNow(product: any) {
    const currentUser = this.authService.getUserInfo();
    if (currentUser) {
      const userid = currentUser.id;
      this.cartService.getCart().subscribe((cartItems) => {
        const existingCartItem = cartItems.find((item) => item.productId === product.id);
        if (existingCartItem) {
          existingCartItem.quantity += 1;
          this.cartService.updateCart(existingCartItem).subscribe(() => {
            Swal.fire('Đã thêm vào giỏ hàng!', '', 'success');
          });
        } else {
          const newCartItem = { ...product, productId: product.id, id: null, quantity: 1, userid };
          this.cartService.addToCart(newCartItem).subscribe(() => {
            Swal.fire('Đã thêm vào giỏ hàng!', '', 'success');
          });
        }
      });
    } else {
      const userid = 0;
      const newCartItem = { ...product, productId: product.id, id: null, quantity: 1, userid };
      this.cartService.addToCart(newCartItem).subscribe(() => {
        Swal.fire('Đã thêm vào giỏ hàng!', '', 'success');
      });
    }
  }
}
