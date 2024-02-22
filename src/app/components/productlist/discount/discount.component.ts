import { Component } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { IProduct } from '../../../entities/products';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.css'
})
export class DiscountComponent {
  filteredProducts: IProduct[] = [];
  products: IProduct[] = [];

  constructor(private cartService: CartService, private http: HttpClient) { }

  filterValue: string = '';

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/products').subscribe(
      (data: any[]) => {
        this.products = data;
        this.filteredProducts = this.products.filter(product => product.sold < 50);
        this.filteredProducts.forEach(product => {
          product.discountedPrice = product.price * 0.5;
        });
      }
    );
  }
  filterProduct(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filteredProducts = this.filteredProducts.filter(p => p.name.toLowerCase().includes(this.filterValue.toLowerCase()));
  }
  sortProductsLowToHigh(): void {
    this.filteredProducts = this.filteredProducts.sort((a, b) => a.price - b.price);
  }
  sortProductsHighToLow(): void {
    this.filteredProducts = this.filteredProducts.sort((a, b) => b.price - a.price);
  }
  Newproducts() {
    const sortedProducts = this.filteredProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.filteredProducts = sortedProducts;
  }
  Oldproducts() {
    const oldedProduct = this.filteredProducts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.filteredProducts = oldedProduct;
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
        this.filteredProducts = [...this.filteredProducts];
        break;
    }
  }
  buyNow(product: any) {
    this.cartService.getCart().subscribe((cartItems) => {
      const existingCartItem = cartItems.find((item) => item.productId === product.id);
      if (existingCartItem) {
        existingCartItem.quantity += 1;
        this.cartService.updateCart(existingCartItem).subscribe(() => {
            Swal.fire('Đã thêm vào giỏ hàng!', '', 'success');
        });
      } else {
        const newCartItem = { ...product, productId: product.id, id: null, quantity: 1 };
        this.cartService.addToCart(newCartItem).subscribe(() => {
            Swal.fire('Đã thêm vào giỏ hàng!', '', 'success');
          });
      }
    });
  }
}
