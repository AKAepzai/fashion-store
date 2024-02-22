import { Component } from '@angular/core';
import { CartService } from '../../../service/cart.service';
import { ICategory } from '../../../entities/category';
import { IProduct } from '../../../entities/products';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-hot-product',
  templateUrl: './hot-product.component.html',
  styleUrl: './hot-product.component.css'
})
export class HotProductComponent {
  constructor(private cartService: CartService, private http: HttpClient) {}
  products : IProduct[]=[];
  listProduct: IProduct[] = [];

  filterValue: string = '';
  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/products').subscribe(
      (data: any[]) => {
        this.products = data;
        this.listProduct = this.products.filter(product => product.sold > 80);
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
    const sortedProducts = this.listProduct.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.listProduct = sortedProducts;
  }
  Oldproducts(){
    const oldedProduct = this.listProduct.sort((a,b) => new Date(a.date).getTime() -new Date(b.date).getTime());
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
      this.listProduct = [...this.listProduct ];
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
