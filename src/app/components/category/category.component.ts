import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../service/cart.service';
import { IProduct } from '../../entities/products';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  products: IProduct[] = [];
  category!: number;
  categoryProduct: IProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    // Sử dụng HttpClient để lấy dữ liệu từ API
    this.httpClient.get<IProduct[]>('http://localhost:3000/products').subscribe(data => {
      this.products = data;
      this.route.paramMap.subscribe(params => {
        this.category = parseInt(params.get('id') || '');
        this.categoryProduct = this.products.filter(product => product.categoryId === this.category);
      });
    });
  }

  originalList: IProduct[] = [];
  filterValue: string = '';

  filterProduct(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.categoryProduct = this.products.filter(p => p.name.toLowerCase().includes(this.filterValue.toLowerCase()));
  }

  sortProductsLowToHigh(): void {
    this.categoryProduct = this.categoryProduct.sort((a, b) => a.price - b.price);
  }

  sortProductsHighToLow(): void {
    this.categoryProduct = this.categoryProduct.sort((a, b) => b.price - a.price);
  }

  Newproducts(): void {
    const sortedProducts = this.categoryProduct.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.categoryProduct = sortedProducts;
  }

  Oldproducts(): void {
    const oldedProduct = this.categoryProduct.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.categoryProduct = oldedProduct;
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
        this.categoryProduct = [...this.categoryProduct];
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
